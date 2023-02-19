// DB : DataBase No SQL - MongoDB(mongoose)
// mongoose : là thư viện sử dụng cung cấp dịch vụ các hàm thao tác vs DB .
LOGIN Work flow API
<!-- Data : req.body
     Type : JSON
     Method : POST
     {
         "userName":"lehoanglinh",
         "passWord":"1"
     }
 -->
 
PROGRAM login // bước định nghĩa tên hàm   req: request , res : response 
START   // bắt đầu chạy 
INPUT req, res,
      req.body = {userName, passWord};   // query , params , body 
GET   userCheck = DB.findOne({userName}) // truy vấn dữ liệu từ database - 1 bản ghi 
// check điều kiện 
IF    (useCheck !== null && userCheck)   
      decode = bcrypt.compare(passWord, userCheck.password) // so sánh mật khẩu - check password
      IF decode === true // nếu cả user name và password đúng  
        token = generateAccessToken({userName}) // tạo đoạn mã ngãu nhiên 
        RETURN token, userCheck._id /// kết quả trả về mã token , id của user
      ELSE PRINT "WRONG PASSWORD" // RETURN lỗi 
ELSE 
    RETURN error.message
END

REGISTER Work flow API 
<!-- Data : req.body
     Type : JSON
     Method : POST
     {
         "userName":"lehoanglinh",
         "email":"lehoanglinh",
         "phone":"1111111"
         "passWord":"1"
         .....
     }
 -->
PROGRAM register
START
INPUT req, res,
      req.body = {userName, passWord, email, ...};
GET   userCheck = DB.findOne({email}) // tìm một bản ghi  
IF    useCheck !== null && userCheck
      RETURN PRINT("email da dc dang ky")
ELSE  data = req.body
      saveUser= data.save() // lưu dữ liệu vào db 
      IF !saveUser // check có dữ liệu hay chưa 
        RETURN error.message
RETURN res.json(saveUser)    
END


// chỉ thực hiện khi mà user đã thực hiện login Cookie , Session  
LOGOUT work flow 
PROGRAM logout khai báo định nghĩa
START 
GET   token = localStorage.get("token") /// dạng dữ liệu này sẽ là một String 
RETURN   clearToken = localStorage.delete("DELETE") // xóa cái token 
END