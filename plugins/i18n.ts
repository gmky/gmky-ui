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
        common_table_delete: 'Xóa',
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

        linkage_title: 'Liên kết sàn',
        linkage_table_domain: 'Sàn',
        linkage_table_username: 'Tên đăng nhập',
        linkage_table_action_disable: 'Khóa',
        linkage_table_action_enable: 'Kích hoạt',

        package_title: 'Gói đầu tư',
        package_table_name: 'Tên',
        package_table_initial_balance: 'Vốn',
        package_table_remaining_balance: 'Còn lại',
        package_table_start_at: 'Bắt đầu',
        package_table_end_at: 'Kết thúc',
        package_table_action_disable: 'Đóng',
        package_table_action_enable: 'Mở'
      }
    }
  })

  vueApp.use(i18n)
})