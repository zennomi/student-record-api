# Student Tracking API Doc

# API theo vết điểm số của sinh viên trên blockchain

## Mô tả

API cho phép người dùng đọc, ghi dữ liệu điểm số của sinh viên trên blockchain.

## Mục đích

Khai thác tính bất biến của dữ liệu được lưu trên blockchain.

## Source Code

[https://github.com/zennomi/student-record-api](https://github.com/zennomi/student-record-api)

## Tech

- Stack: Solidity, ExpressJS, NodeJS.
- Tool:
    - Remix: write, compile, migrate smart contract lên Rinkeby Test Network.
    - Metamask: quản lý ví.
    - Infura: node cho backend đọc ghi dữ liệu trên Rinkeby Test Network.
    - Heroku: deploy backend.
    - Postman: Demo API.

## Kiến thức đã học được

- Ăn xin ETH free trên Rinkeby Test Network.
- Đồng bộ file giữa Remix và Local qua remixd npm.
- Migrate smart contract lên Rinkeby Test Network từ Remix và Truffle.
- Cách sử dụng Infura, kết nối từ backend vào Infura để đọc ghi dữ liệu trên blockchain.
- Các methods trong web.eth.
- Nhiều câu hỏi không có giải đáp trên stackoverflow như hồi code web, phải tự vọc trong document của Infura và Web3 😢

## Giải thích contract

Admin.sol (giới hạn một số quyền như thay đổi thông tin sinh viên).

```solidity
contract Admin {
    address public admin;

    constructor() public {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }
}
```

StudentFactory.sol (thao tác thêm, sửa thông tin sinh viên)

Khi gọi API, chủ yếu thao tác với MSSV nên mình cần map từ MSSV sang index trong mảng `stdIdToIndex`.

```solidity
contract StudentFactory is Admin {
    mapping (string => uint) stdIdToIndex; // start from 1, map tu MSSV sang index trong array
    Student[] public students;

    struct Student {
        string name; // ten sinh vien
        string iCNo; // ma can cuoc cong dan
        string id; // ma so sinh vien
        uint recordCount; // so luong ban ghi ket qua hoc tap da luu tren blockchain
    }

	//...
}
```

Nhưng `stdIdToIndex` bắt đầu từ 1 vì nếu MSSV không tồn tại trả về 0. Thêm một hàm phụ kiểm tra xem MSSV có tồn tại trong blockchain không và trả về đúng index bắt đầu từ 0.

```solidity
    function getArrIndexByStdId(string memory _stdId) public view returns (uint) {
        uint index = stdIdToIndex[_stdId];
        require(index > 0, "Not Found Student With This Id");
        return index-1;
    }
```

Function thêm sinh viên.

```solidity
    function _addStudent(string memory _name, string memory _iCNo, string memory id) private {
        Student memory newStudent = Student(_name, _iCNo, id, 0);
        students.push(newStudent);
    }

    function addStudent(string memory _stdId, string memory _name, string memory _iCNo) public {
        require(stdIdToIndex[_stdId] == 0, "StudentID existed"); // kiem tra trung mssv
        _addStudent(_name, _iCNo, _stdId);
        stdIdToIndex[_stdId] = students.length;
    }
```

Function thay đổi sinh viên bằng MSSV (Chỉ admin, tránh thay đổi tuỳ tiện).

```solidity
		function _changeStudent(uint _index, string memory _name, string memory _iCNo) private {
        students[_index].name = _name;
        students[_index].iCNo = _iCNo;
    }

    function changeStudentByStdId(string memory _stdId, string memory _name, string memory _iCNo) public onlyAdmin {
        uint index = getArrIndexByStdId(_stdId);
        _changeStudent(index, _name, _iCNo);
    }
```

RecordTracking.sol (thêm, sửa xoá bản ghi điểm sinh viên, vì mục đích demo nên tối thiểu số field cần thiết)

```solidity
contract RecordTracking is StudentFactory {
    struct Record {
        string subjectId; // mã môn
        uint stdIndex; // index sinh vien trong array
        uint timestamp; // thoi gian them ban ghi
        uint8 mark; // diem
    }

    Record[] public records;
		...
 }
```

Thêm bản ghi kết quả học tập mới theo MSSV

```solidity
		function _addRecord(string memory _subjectId, uint _stdIndex, uint8 _mark) private {
        records.push(Record(_subjectId, _stdIndex, block.timestamp, _mark));
        students[_stdIndex].recordCount++;
    }

    function addRecordByStdId(string memory _stdId, string memory _subjectId, uint8 _mark) public {
        uint index = getArrIndexByStdId(_stdId);
        require(_mark <= 100, "Invalid Mark");
        _addRecord(_subjectId, index, _mark);
    }
```

Lấy danh sách index bản ghi kết quả học tập của SV theo MSSV

```solidity
		function getRecordIndexesByStdId(string memory _stdId) public view returns (uint[] memory) {
        uint index = getArrIndexByStdId(_stdId);
        uint[] memory results = new uint[](students[index].recordCount);
        uint total;
        for (uint i=0; i<records.length; i++) {
            if (records[i].stdIndex == index) {
                results[total] = i;
                total++;
            }
        }
        return results;
    }
```

## RESTful API

```jsx
app.route("/students").get(studentController.getAll);

app.route("/student").post(studentController.postIndex);

app.route("/student/:stdId")
    .get(studentController.get)
    .post(studentController.post);

app.route("/records/student/:stdId")
    .get(recordController.getByStdId)
    .post(recordController.postByStdId);

app.route("/records/subject/:subjectId").get(recordController.getByStdId);
```

## Demo

### Lấy dữ liệu toàn bộ sinh viên

```abap
curl --location --request GET 'https://student-record-tracking.herokuapp.com/students'
```

```json
[
    {
        "0": "Mae Labadie",
        "1": "437-743-7504",
        "2": "20194472",
        "3": "1",
        "name": "Mae Labadie",
        "iCNo": "4377437504",
        "id": "20194472",
        "recordCount": "1"
    },
    {
        "0": "Viola Schuster",
        "1": "832-492-1886",
        "2": "20194469",
        "3": "3",
        "name": "Viola Schuster",
        "iCNo": "8324921886",
        "id": "20194469",
        "recordCount": "3"
    }
]
```

### Lấy dữ liệu sinh viên theo MSSV

```abap
curl --location --request GET 'https://student-record-tracking.herokuapp.com/student/20195555'
```

```json
{
    "0": "Viola Schuster",
    "1": "8324921886",
    "2": "20194469",
    "3": "3",
    "name": "Viola Schuster",
    "iCNo": "8324921886",
    "id": "20194469",
    "recordCount": "3"
}
// or
{
    "error": {
        "reason": "Not Found Student With This Id",
        "signature": "Error(String)"
    }
}
```

### Thêm sinh viên mới

```abap
curl --location --request POST 'https://student-record-tracking.herokuapp.com/student' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=Sandy Roob' \
--data-urlencode 'stdId=20195555' \
--data-urlencode 'iCNo=123456789'
```

```json
// POST {{base_url}}/student
// stdId: {{sample_id}}; iCNo: 123456789
{
    "status": "success",
    "result": {
        "blockHash": "0x49ced88f2a15d05ad103b91b86e41215b470a3a80f7557661de0d622d3151773",
        "blockNumber": 9823346,
        "contractAddress": null,
        "cumulativeGasUsed": 577033,
        "effectiveGasPrice": "0xa1f817d0",
        "from": "0xf28a06cee56473d731dbc29ea037b5d362b8b4dd",
        "gasUsed": 121839,
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": true,
        "to": "0xe62cd3d1c0bbcd9ea98f2b1f18fc3a7c77ee46c9",
        "transactionHash": "0xdb858fa5c08ddb7378a7fcbee797c147ad74b355c071a5072914c5d6b2489069",
        "transactionIndex": 7,
        "type": "0x2",
        "events": {}
    }
}
// or
{
    "error": {
        "reason": "StudentID existed",
        "signature": "Error(String)",
        "receipt": {
            "blockHash": "0x9d60bed6638fa62e5a58ac1c3b55cdc9524d684af2a6e08282723da77e23bc13",
            "blockNumber": 9823347,
            "contractAddress": null,
            "cumulativeGasUsed": 5536735,
            "effectiveGasPrice": "0xa2c7a537",
            "from": "0xf28a06cee56473d731dbc29ea037b5d362b8b4dd",
            "gasUsed": 26517,
            "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
            "status": false,
            "to": "0xe62cd3d1c0bbcd9ea98f2b1f18fc3a7c77ee46c9",
            "transactionHash": "0x9c0d494d1bd98d6c99eb6e46e5d436a707642d0fd9da8f803883253648db818a",
            "transactionIndex": 18,
            "type": "0x2",
            "events": {}
        }
    }
}
```

### Thay đổi sinh viên theo MSSV (only Admin)

```abap
curl --location --request POST 'https://student-record-tracking.herokuapp.com/student/20195555' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'name=Cathy Fisher' \
--data-urlencode 'iCNo=987654321'
```

```json
{
    "status": "success",
    "result": {
        "blockHash": "0x6ca78effff01545749dc7821b0da822feaa0cae058c12e6eb2d5b123f02dae98",
        "blockNumber": 9823351,
        "contractAddress": null,
        "cumulativeGasUsed": 8384043,
        "effectiveGasPrice": "0xa2682332",
        "from": "0xf28a06cee56473d731dbc29ea037b5d362b8b4dd",
        "gasUsed": 46291,
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": true,
        "to": "0xe62cd3d1c0bbcd9ea98f2b1f18fc3a7c77ee46c9",
        "transactionHash": "0x76353088946cb66b7dc422e74cfd4779ddfafb008e49083ff56af0a37327b8f7",
        "transactionIndex": 14,
        "type": "0x2",
        "events": {}
    }
}
```

### Lấy kết quả học tập theo MSSV

```abap
curl --location --request GET 'https://student-record-tracking.herokuapp.com/records/student/20194469'
```

```json
[
    {
        "0": "Renee",
        "1": "1",
        "2": "1639243504",
        "3": "40",
        "subjectId": "TTHCM",
        "stdIndex": "1",
        "timestamp": "1639243504",
        "mark": "40"
    },
    {
        "0": "Otha",
        "1": "1",
        "2": "1639243610",
        "3": "40",
        "subjectId": "CNXH",
        "stdIndex": "1",
        "timestamp": "1639243610",
        "mark": "40"
    },
    {
        "0": "Lucile",
        "1": "1",
        "2": "1639243625",
        "3": "80",
        "subjectId": "CSDL",
        "stdIndex": "1",
        "timestamp": "1639243625",
        "mark": "80"
    }
]
```

### Thêm kết quả học tập mới

```abap
curl --location --request POST 'https://student-record-tracking.herokuapp.com/records/student/20194469' \
--header 'Content-Type: application/x-www-form-urlencoded' \
--data-urlencode 'subjectId=DSTT' \
--data-urlencode 'mark=80'
```

```json
{
    "status": "success",
    "result": {
        "blockHash": "0x7a8437a713652f098844f5236191051826d7a73acd1531bb917524698c266971",
        "blockNumber": 9823383,
        "contractAddress": null,
        "cumulativeGasUsed": 6540925,
        "effectiveGasPrice": "0xa3801bf6",
        "from": "0xf28a06cee56473d731dbc29ea037b5d362b8b4dd",
        "gasUsed": 127085,
        "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        "status": true,
        "to": "0xe62cd3d1c0bbcd9ea98f2b1f18fc3a7c77ee46c9",
        "transactionHash": "0xaaa7aafc536f80397a0f973ffdc79c3a850d1dd7a0540cf829256b5c0beb60ac",
        "transactionIndex": 16,
        "type": "0x2",
        "events": {}
    }
}
```

### Lấy địa chỉ node đang dùng

```abap
curl --location --request GET 'https://student-record-tracking.herokuapp.com/sender'
```

```json
"0x0000000000000000000000000000000000000000" // infura khong unlock account address
```

### Lấy địa chỉ Admin

```abap
curl --location --request GET 'https://student-record-tracking.herokuapp.com/admin'
```

```json
"0xf28A06Cee56473d731DbC29eA037B5D362b8b4dd"
```