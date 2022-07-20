export const headCells = [
  { id: 'id', numeric: false, disablePadding: false, label: 'Mã đăng ký', maxWidth: 150 },
  { id: 'department_name', numeric: false, disablePadding: false, label: 'Tên phòng ban', maxWidth: 150 },
  { id: 'department_parent', numeric: false, disablePadding: false, label: 'Trực thuộc phòng ban', maxWidth: 150 },
  { id: 'number_member', numeric: false, disablePadding: false, label: 'Số thành viên', maxWidth: 150 },
  
  { id: 'fullname', numeric: false, disablePadding: false, label: 'Khách hàng', maxWidth: 150 },
  { id: 'university_name', numeric: false, disablePadding: false, label: 'Trường', maxWidth: 100 },
  { id: 'account_id', numeric: false, disablePadding: false, label: 'ID', maxWidth: 50 },
  { id: 'image_url', numeric: false, disablePadding: false, label: 'Ảnh', maxWidth: 100 },
  { id: 'full_name', numeric: false, disablePadding: false, label: 'Tên', maxWidth: 150 },
  { id: 'email_address', numeric: false, disablePadding: false, label: 'Email', maxWidth: 100 },
  { id: 'number_phone', numeric: false, disablePadding: false, label: 'SĐT', maxWidth: 100 },
  {
    id: 'schedule',
    numeric: false,
    disablePadding: false,
    label: 'Lịch tư vấn',
    maxWidth: 100,
  },
  { id: 'career', numeric: false, disablePadding: false, label: 'Ngành', maxWidth: 100 },
  { id: 'assess', numeric: true, disablePadding: false, label: 'Đánh giá', maxWidth: 150 },
  { id: 'mentor_name', numeric: false, disablePadding: false, label: 'Mentor', maxWidth: 100 },
  { id: 'link', numeric: false, disablePadding: false, label: 'Link', maxWidth: 100 },
  { id: 'status', numeric: false, disablePadding: false, label: 'Trạng thái', maxWidth: 100 },
  { id: 'rating', numeric: false, disablePadding: false, label: 'Đánh giá', maxWidth: 100 },
  { id: 'total', numeric: false, disablePadding: false, label: 'Tổng số', maxWidth: 100 },
  { id: 'reject', numeric: false, disablePadding: false, label: 'Từ chối', maxWidth: 100 },
  {
    id: 'uncomplete',
    numeric: false,
    disablePadding: false,
    label: 'Chưa hoàn thành',
    maxWidth: 150,
  },
  { id: 'note', numeric: false, disablePadding: false, label: 'Chú thích', maxWidth: 100 },
  { id: 'active', numeric: false, disablePadding: false, label: 'Hoạt động', maxWidth: 100 },
  { id: 'menuButtons', numeric: false, disablePadding: false, label: '', maxWidth: 150 },
];

export const bookingStatusList = [
  'Chờ khách hàng',
  'Chờ mentor',
  'Đã lên lịch tư vấn',
  'Đang tư vấn',
  'Chờ Feedback',
  'Khách hàng chưa xác nhận',
  'Mentor chưa xác nhận',
  'Mentor từ chối lịch',
  'Khách hàng chưa Feedback',
  'Meeting bị gián đoạn',
  'Khách yêu cầu hủy',
  'Mentor yêu cầu hủy',
]