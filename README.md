CSE Students Attendance Website


I.	Requirements
- 	Thiết kế bao gồm những trang sau:
+	Trang đăng ký: đăng ký tài khoản được xác định khóa bằng email hcmut, bao gồm các nội dung cơ bản như tên, ngày sinh, MSSV, SĐT, mật khẩu, quyền member (default),...
-> {
	- check email real + đuôi hcmut
	- check ngày sinh (front hoặc back làm?)
	- check mssv (7 kí tự)
	- Mk (ít nhất 8 kí tự)
	- quyền?
} //done
+ 	Trang đăng nhập: Đăng nhập dựa vào email hcmut và mật khẩu, hiện lỗi nếu sai mật khẩu hoặc tài khoản không tồn tại,.. (advance: sử dụng thêm google Oauth cho login).
->{
•	check email exist
•	check mật khẩu
•	gắn jwt 
} //done
+	Trang chủ: Member có thể đăng ký sự kiện để điểm danh sinh viên bao gồm những thông tin như tên sự kiện, thời gian, nơi diễn ra, sử dụng tập dữ liệu tùy chỉnh (tải lên tập dữ liệu) hay chọn tập dữ liệu được cung cấp.
->{
•	add event //ok
•	add danh sách ->{
- nếu user tự tải file -> lưu vào 1 file temp -> lấy data -> insert vô db
- nếu dùng file của admin -> chỉ gửi file qua cho xem, không gửi về, gửi cái ID của nó -> lấy tập data đã có sẵn -> insert vô db
}
}
+	Trang thông tin cá nhân: hiển thị thông tin cá nhân của bản thân và có thể chỉnh sửa và có thêm lịch sử đăng ký sự kiện (đã và đang được đăng ký).
->{
•	lấy data user (dùng jwt?)
•	modify user
•	xóa user?
•	lấy lịch sử đk sự kiện (query?)
} //done
+	Trang điểm danh sinh viên: Dựa vào từng sự kiện với tập dữ liệu khác nhau thì chỉ điểm danh trên tập dữ liệu đó. Có 1 ô để nhập MSSV hay quẹt thẻ và sẽ hiển thị sinh viên vừa quẹt phía dưới (làm cho cả quẹt vào và ra).
->{}


+	Trang phê duyệt (Chỉ cho admin): Admin vào trang này sẽ xem được danh sách những đơn đăng ký sự kiện từ member và xem chi tiết từng đơn, có thể accept hoặc reject. 
->{
•	lấy những event đang pending
•	có lấy attendance list?
}
+	 Trang quản lý sự kiện (Chỉ cho admin): Admin vào trang này sẽ xem được những đơn đăng ký sự kiện đã được accept cũng như reject.
->{
•	lấy những event đã accept hoặc reject
}//done
+	Trang quản lý tập dữ liệu (Chỉ cho admin): Admin vào trang này sẽ thêm, xóa sửa hoặc tải lên file, xuất file (csv, excel) cho mỗi tập dữ liệu sinh viên.
->{
•	Thêm: front gửi file excel -> back lưu id vô db + lưu file đó vào 1 thư mục public (+ xử lí sẵn data để sau này lấy cho nhanh?)
•	Xóa: front gửi id -> back drop id + xóa file
•	Sửa: front tự xử
•	Xuất file: front gọi tới file public để lấy (khi hiển thị giao diện front phải lưu lại ID + link tải)

}
+	Trang tài khoản (Chỉ cho admin): Admin vào trang này sẽ phê duyệt các đơn đăng ký tài khoản của member, những tài khoản nào được phê duyệt mới có thể đăng nhập vào. Ngoài ra admin cũng có thể cấp quyền cho tài khoản đó là admin.
->{
•	get all ‘pending’ user
•	modify user.status
}

-	Note: 
+	Những trang admin chỉ được vào bởi tài khoản admin, member vào hiện lỗi.
+	Mật khẩu phải được hash để bảo mật.
+	Trang web phải trực quan và dễ dàng thao tác với người dùng và đảm bảo response.
+ 	Có thể sử dụng framework CSS để thực hiện.


Technologies
-	Databases: MySQL, SQL server, Oracle.
-	Backend: NodeJs.
-	Frontend: Reactjs, VueJS.


Note:
•	Ngăn quyền add,modify của user tới cá trường “pending” và “role” trong bảng event và user
•	
