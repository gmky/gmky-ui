import { createI18n } from 'vue-i18n'

export default defineNuxtPlugin(({ vueApp }) => {
  const i18n = createI18n({
    legacy: false,
    globalInjection: true,
    locale: 'vi',
    messages: {
      en: {
        common_table_display: 'Display',
        user_title: 'Users',
        user_filter_placeholder: 'Filter users...',
        user_new_user_btn: 'New user',
        user_status_all: 'All statuses',
        user_table_username: 'Username',
        user_table_full_name: 'Full name',
        user_table_email: 'Email',
        user_table_status: 'Status',
        user_table_action: 'Action',
        user_table_action_edit: 'Edit',
        user_table_action_lock: 'Lock',
        user_table_action_unlock: 'Unlock',
        user_table_action_logout: 'Logout',
        user_new_user_modal_title: 'New user',
        user_new_user_modal_desc: 'Add a new user to your database',
        user_edit_modal_title: 'Edit user',
        user_edit_modal_desc: 'Update user information'
      },
      vi: {
        common_table_display: 'Cột',
        common_table_action: 'Thao tác',
        common_table_status: 'Trạng thái',
        common_table_edit: 'Chỉnh sửa',
        common_table_detail: 'Chi tiết',
        common_table_delete: 'Xóa',
        common_form_save: 'Lưu',
        common_form_cancel: 'Hủy',
        common_confirmation_yes: 'Đồng ý',
        common_confirmation_no: 'Hủy',
        user_title: 'Người dùng',
        user_filter_placeholder: 'Lọc người dùng...',
        user_new_user_btn: 'Tạo mới',
        user_status_all: 'Tất cả trạng thái',
        user_table_username: 'Tên đăng nhập',
        user_table_full_name: 'Họ và Tên',
        user_table_email: 'Email',
        user_table_action: 'Thao tác',
        user_table_action_lock: 'Khóa',
        user_table_action_unlock: 'Mở khóa',
        user_table_action_logout: 'Đăng xuất',
        user_new_user_modal_title: 'Tạo mới người dùng',
        user_new_user_modal_desc: 'Tạo mới người dùng trên hệ thống',
        user_edit_modal_title: 'Chỉnh sửa người dùng',
        user_edit_modal_desc: 'Chỉnh sửa thông tin người dùng',
        user_create_form_username_label: 'Tên đăng nhập',
        user_create_form_password_label: 'Mật khẩu',
        user_create_form_re_pass_label: 'Nhập lại mật khẩu',
        user_create_form_first_name_label: 'Họ',
        user_create_form_last_name_label: 'Tên',
        user_create_form_status_label: 'Trạng thái',
        user_create_form_role_label: 'Vai trò',
        user_create_form_role_search_placeholder_label: 'Tìm kiếm vai trò...',
        user_update_success_msg: 'Cập nhật người dùng thành công',
        user_date_failed_msg: 'Cập nhật người dùng thất bại',

        linkage_title: 'Liên kết sàn',
        linkage_table_domain: 'Sàn',
        linkage_table_username: 'Tên đăng nhập',
        linkage_table_action_disable: 'Khóa',
        linkage_table_action_enable: 'Kích hoạt',
        linkage_table_live_id: 'Tài khoản thực',
        linkage_table_demo_id: 'Tài khoản demo',

        investment_title: 'Gói đầu tư',
        investment_table_name: 'Tên',
        investment_table_bet_count: 'Cược',
        investment_table_balance: 'Vốn',
        investment_table_count_win: 'Thắng',
        investment_table_count_lose: 'Thua',
        investment_table_amount_win: 'Tiền thắng',
        investment_table_amount_lose: 'Tiền thua',
        investment_table_strategy_capital: 'Chiến lược vốn',
        investment_table_strategy_signal: 'Chiến lược tín hiệu',
        investment_table_action_disable: 'Đóng',
        investment_table_action_enable: 'Mở',
        investment_table_action_disable_title: 'Đóng gói đầu tư',
        investment_table_action_enable_title: 'Mở gói đầu tư',
        investment_table_action_disable_msg: 'Bạn có chắc chắn muốn đóng gói đầu tư này không?',
        investment_table_action_enable_msg: 'Bạn có chắc chắn muốn mở gói đầu tư này không?',
        investment_update_success: 'Cập nhật gói đầu tư thành công',
        investment_update_failed: 'Cập nhật gói đầu tư thất bại',
        investment_new_investment_btn: 'Tạo gói đầu tư',
        investment_new_investment_modal_title: 'Tạo mới gói đầu tư',
        investment_new_investment_modal_desc: 'Tạo một gói đầu tư của bạn',
        investment_new_success: 'Tạo mới gói đầu tư thành công',
        investment_new_failed: 'Tạo mới gói đầu tư thất bại',

        investment_new_name_title: 'Tên bot',
        investment_new_name_ph: 'Tên bot',
        investment_new_account_type_title: 'Loại tài khoản',
        investment_new_account_type_ph: 'Loại tài khoản',
        investment_new_signal_title: 'Chiến lược tín hiệu',
        investment_new_signal_ph: 'Chiến lược tín hiệu',
        investment_new_capital_title: 'Chiến lược vốn',
        investment_new_capital_ph: 'Chiến lược vốn',
        investment_new_command_title: 'Các lệnh cược',
        investment_new_command_ph: 'Các lệnh cược',
        investment_new_rule_capital_title: 'Hình thức cược',
        investment_new_rule_capital_ph: 'Hình thức cược',
        investment_new_max_win_title: 'Số tiền lãi tối đa',
        investment_new_max_win_ph: 'Số tiền lãi tối đa',
        investment_new_max_lose_title: 'Số tiền thua tối đa',
        investment_new_max_lose_ph: 'Số tiền thua tối đa',
        investment_new_balance_title: 'Hạn mức đầu tư',
        investment_new_balance_ph: 'Hạn mức đầu tư',
        investment_detail_title: 'Chi tiết gói đầu tư',
        investment_detail_desc: 'Thông tin chi tiết về gói đầu tư của bạn',
        investment_detail_table_account_id: 'Tài khoản',
        investment_detail_table_action: 'Mua/Bán',
        investment_detail_table_status: 'Trạng thái',
        investment_detail_table_amount: 'Giá trị',
        investment_detail_table_amount_win: 'Thắng',
        investment_detail_table_amount_lose: 'Thua',
        investment_detail_table_created_at: 'Đặt lệnh',
        investment_detail_table_updated_at: 'Cập nhật',

        role_title: 'Vai trò',
        role_table_name: 'Tên',
        role_table_desc: 'Mô tả',
        role_table_type: 'Loại',
        role_table_default: 'Mặc định',
        role_table_update_modal_title: 'Cập nhật vai trò',
        role_table_set_default_msg: 'Bạn có muốn đặt vai trò này làm vai trò mặc định cho người dùng mới?',
        role_table_unset_default_msg: 'Bạn có muốn loại bỏ vai trò này khỏi vai trò mặc định không?',
        role_update_success: 'Cập nhật vai trò thành công',
        role_update_failed: 'Cập nhật vai trò thất bại',
        role_table_disable_msg: 'Bạn có chắc chắn muốn hủy kích hoạt vai trò này không?',
        role_table_enable_msg: 'Bạn có chắc chắn muốn kích hoạt vai trò này không?',
        role_table_delete_msg: 'Bạn có chắc chắn muốn xóa vai trò này không?',
        role_table_action_unset_default_btn: 'Bỏ mặc định',
        role_table_action_set_default_btn: 'Đặt làm mặc định',
        role_table_action_disable_btn: 'Tắt',
        role_table_action_enable_btn: 'Kích hoạt',
        role_create_btn: 'Tạo mới',
        role_create_modal_title: 'Tạo mới vai trò',
        role_create_modal_desc: 'Tạo mới vai trò trên hệ thống',
        role_filter_placeholder: 'Lọc vai trò...',
        role_create_form_success: 'Tạo mới vai trò thành công',
        role_create_form_failed: 'Tạo mới vai trò thất bại',
        role_create_form_name_label: 'Tên',
        role_create_form_desc_label: 'Mô tả',
        role_create_form_status_label: 'Trạng thái',
        role_create_form_default_label: 'Mặc định',
        role_create_form_ps_label: 'Nhóm quyền',
        role_create_form_ps_search_ph: 'Tìm kiếm nhóm quyền',
        role_create_form_name_validation_msg: 'Vui lòng nhập tên',
        role_create_form_desc_validation_msg: 'Vui lòng nhập mô tả',
        role_create_form_status_validation_msg: 'Vui lòng chọn trạng thái',
        role_create_form_default_validation_msg: 'Vui lòng chọn giá trị mặc định',

        ps_title: 'Nhóm quyền',
        ps_create_btn: 'Tạo nhóm quyền',
        ps_create_modal_title: 'Tạo mới nhóm quyền',
        ps_create_modal_desc: 'Tạo mới nhóm quyền trên hệ thống',
        ps_update_modal_title: 'Cập nhật nhóm quyền',
        ps_update_modal_desc: 'Cập nhật nhóm quyền trên hệ thống',
        ps_table_name: 'Tên',
        ps_table_desc: 'Mô tả',
        ps_table_type: 'Loại',
        ps_delete_modal_title: 'Xóa nhóm quyền',
        ps_delete_modal_msg: 'Bạn có chắc chắn muốn xóa nhóm quyền này không?',
        ps_create_form_name: 'Tên',
        ps_create_form_name_ph: 'Nhập tên quyền',
        ps_create_form_desc: 'Mô tả',
        ps_create_form_desc_ph: 'Nhập mô tả quyền',
        ps_create_form_permission: 'Quyền',
        ps_create_form_permission_ph: 'Tìm kiếm quyền...',
        ps_create_success: 'Tạo mới nhóm quyền thành công',
        ps_create_failed: 'Tạo mới nhóm quyền thật bại',
        ps_update_success: 'Cập nhật nhóm quyền thành công',
        ps_update_failed: 'Cập nhật nhóm quyền thất bại',
        ps_update_form_permission_label: 'Quyền',
        ps_update_form_search_permission_ph: 'Tìm kiếm quyền...',

        permission_title: 'Quyền',
        permission_table_resource_code: 'Mã tài nguyên',
        permission_table_permission_code: 'Mã quyền',
        permission_table_desc: 'Mô tả',
        permission_table_search_resource: 'Tìm kiếm theo tài nguyên',
        permission_table_search_permission: 'Tìm kiếm theo quyền',

        login_form_username_label: 'Tên đăng nhập',
        login_form_password_label: 'Mật khẩu',
        login_form_remember_me_label: 'Ghi nhớ đăng nhập',
        login_form_username_validation_msg: 'Vui lòng nhập tên đăng nhập',
        login_form_password_validation_msg: 'Vui lòng nhập mật khẩu',
        login_result_error: 'Có lỗi xảy ra trong quá trình đăng nhập',
        login_forgot_password: 'Quên mật khẩu?',
        login_form_msg: `Bạn chưa có tài khoản?`,
        login_form_reg_link: 'Đăng ký ngay',
        login_form_title: 'Đăng nhập',
        login_form_submit_btn: 'Đăng nhập',

        register_form_title: 'Tạo mới tài khoản',
        register_form_msg: 'Đã có tài khoản?',
        register_form_login_link: 'Đăng nhập ngay',
        register_form_first_name_label: 'Họ',
        register_form_first_name_ph: 'Vui lòng nhập họ',
        register_form_last_name_label: 'Tên',
        register_form_last_name_ph: 'Vui lòng nhập tên',
        register_form_username_label: 'Tên đăng nhập',
        register_form_username_ph: 'Vui lòng nhập tên đăng nhập',
        register_form_email_label: 'Email',
        register_form_email_ph: 'Vui lòng nhập địa chỉ email',
        register_form_password_label: 'Mật khẩu',
        register_form_password_ph: 'Vui lòng nhập mật khẩu',
        register_form_submit_btn: 'Đăng ký tài khoản',
        register_result_error: 'Đăng ký tài khoản thất bại',
        register_success_msg: 'Đăng ký tài khoản thành công',

        linkage_create_btn: 'Liên kết sàn',
        linkage_create_modal_title: 'Liên kết sàn đầu tư',
        linkage_create_modal_desc: 'Liên kết sàn đầu tư với tài khoản của bạn',
        linkage_create_form_domain_validation: 'Vui lòng nhập địa chỉ của sàn muốn liên kết',
        linkage_create_form_username_validation: 'Vui lòng nhập tên đăng nhập',
        linkage_create_form_password_validation: 'Vui lòng nhập mật khẩu',
        linkage_create_form_domain: 'Địa chỉ sàn',
        linkage_creat_form_domain_ph: 'Nhập địa chỉ sàn',
        linkage_create_form_username: 'Tên đăng nhập',
        linkage_create_form_username_ph: 'Nhập tên đăng nhập',
        linkage_create_form_password: 'Mật khẩu',
        linkage_create_form_password_ph: 'Nhập mật khẩu',
        linkage_create_form_link_success: 'Liên kết sàn thành công',
        linkage_create_form_link_failed: 'Liên kết sàn thất bại',

        notification_title: 'Thông báo'
      }
    }
  })

  vueApp.use(i18n)
})