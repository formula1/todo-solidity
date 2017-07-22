pragma solidity ^0.4.11;

contract ToDoTask {
    uint public MINIMUM_TITLE_LENGTH = 8 * 2;
    uint public MAXIMUM_TITLE_LENGTH = 128 * 2;
    address public creator;
    string public title;
    string public url;

    bytes32 public accepted_solution;
    uint public totalbounty = 0;
    address[] private funders;
    mapping (address => uint) private bounties;
    mapping (bytes32 => Solution) private solutions;
    State public state = State.Open;

    enum State {
      Open, Cancelled, Completed
    }


    struct Solution {
      bytes32 id;
      address creator;
      string title;
      string url;
    }



    event bountyAdded(address accountAddress, uint amount);
    event bountyWithdrew(address accountAddress, uint amount);
    event emitPayoutSuccess(address accountAddress, uint amount);
    event emitPayoutFailure(address accountAddress, uint amount);


    function ToDoTask(
      string _title,
      string _url
    ) {
      uint length = bytes(_title).length;

      assert(MAXIMUM_TITLE_LENGTH > length);

      assert(length > MINIMUM_TITLE_LENGTH);

      creator = msg.sender;
      title = _title;
      url = _url;
    }


    function updateTitle(string _title){
      uint length = bytes(_title).length;

      assert(MAXIMUM_TITLE_LENGTH > length);

      assert(length > MINIMUM_TITLE_LENGTH);

      title = _title;
    }

    function depositBounty() payable isOpen() returns (uint) {
      if(bounties[msg.sender] == 0){
        funders[funders.length++] = msg.sender;
      }

      totalbounty += msg.value;
      bounties[msg.sender] += msg.value;
      bountyAdded(msg.sender, msg.value);
      return bounties[msg.sender];
    }

    function withdrawBounty(uint amount) public isOpen() returns (uint) {
      assert(bounties[msg.sender] != 0);
      assert(bounties[msg.sender] >= amount);

      bounties[msg.sender] -= amount;
      totalbounty -= amount;
      if (!msg.sender.send(amount)) {
          bounties[msg.sender] += amount;
          totalbounty += amount;
      } else {
        bountyWithdrew(msg.sender, amount);
        if (bounties[msg.sender] == 0) {
          delete bounties[msg.sender];
        }
      }

      return bounties[msg.sender];
    }

    function submitSolution(
      string title,
      string url
    ) public isOpen() returns (bytes32) {
      var solution_creator = msg.sender;
      var solution_id = sha3(solution_creator, url);
      assert(!solutionExists(solution_id));

      solutions[solution_id] = Solution({
        id: solution_id,
        creator: solution_creator,
        title: title,
        url: url
      });

      return solution_id;
    }

    function retractSolution(
      bytes32 solution_id
    ) public isOpen() returns (bytes32) {
      assert(solutionExists(solution_id));
      assert(solutions[solution_id].creator == msg.sender);
      delete solutions[solution_id];
      return solution_id;
    }

    function acceptSolution(
      bytes32 solution_id
    ) public isOpen() {
      assert(solutionExists(solution_id));
      assert(creator == msg.sender);
      accepted_solution = solution_id;
      state = State.Completed;

      var solution = solutions[accepted_solution];
      assert(solution.creator.send(totalbounty));
      emitPayoutSuccess(solution.creator, totalbounty);
      selfdestruct(solution.creator);
    }

    function cancel() public isOpen() {
      assert(creator != msg.sender);

      state = State.Cancelled;

      for (uint i = 0; i < funders.length; ++i) {
        var funder = funders[i];
        if(bounties[funder] != 0){
          if(funder.send(bounties[funder])){
            emitPayoutSuccess(funder, bounties[funder]);
          } else {
            emitPayoutFailure(funder, bounties[funder]);
          }
        }
      }
      selfdestruct(creator);
    }

    modifier isOpen() {
        assert(state == State.Open);
        _;
    }

    function solutionExists(bytes32 solution_id) constant returns (bool){
      return solutions[solution_id].id == solution_id;
    }

}
