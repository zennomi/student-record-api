pragma solidity ^0.5.0;

import "./StudentFactory.sol";

contract RecordTracking is StudentFactory {
    struct Record {
        string subjectId;
        uint stdIndex;
        uint timestamp;
        uint8 mark;
    }

    Record[] public records;

    function _addRecord(string memory _subjectId, uint _stdIndex, uint8 _mark) private {
        records.push(Record(_subjectId, _stdIndex, block.timestamp, _mark));
        students[_stdIndex].recordCount++;
    }

    function addRecordByStdId(string memory _stdId, string memory _subjectId, uint8 _mark) public {
        uint index = getIndexArrByStdId(_stdId);
        require(_mark <= 100, "Invalid Mark");
        _addRecord(_subjectId, index, _mark);
    }

    function getRecordIndexesByStdId(string memory _stdId) public view returns (uint[] memory) {
        uint index = getIndexArrByStdId(_stdId);
        uint[] memory results = new uint[](records.length);
        uint total;
        for (uint i=0; i<records.length; i++) {
            if (records[i].stdIndex == index) {
                results[total] = i;
                total++;
            }
        }
        return results;
    }
}