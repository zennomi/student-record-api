pragma solidity ^0.5.0;

import "./Admin.sol";

contract StudentFactory is Admin {
    mapping (string => uint) stdIdToIndex; // start from 1
    Student[] public students;

    struct Student {
        string name;
        string iCNo;
        uint recordCount;
    }

    function _addStudent(string memory _name, string memory _iCNo) private {
        Student memory newStudent = Student(_name, _iCNo, 0);
        students.push(newStudent);
    }

    function addStudent(string memory _stdId, string memory _name, string memory _iCNo) public {
        _addStudent(_name, _iCNo);
        stdIdToIndex[_stdId] = students.length;
    }

    function _changeStudent(uint _index, string memory _name, string memory _iCNo) private {
        students[_index].name = _name;
        students[_index].iCNo = _iCNo;
    }

    function changeStudentByStdId(string memory _stdId, string memory _name, string memory _iCNo) public onlyAdmin {
        uint index = getIndexArrByStdId(_stdId);
        _changeStudent(index, _name, _iCNo);
    }

    function getIndexArrByStdId(string memory _stdId) public view returns (uint) {
        uint index = stdIdToIndex[_stdId];
        require(index > 0, "Not Found Student With This Id");
        return index-1;
    }
}

