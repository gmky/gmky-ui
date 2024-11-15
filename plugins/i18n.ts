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
        user_title: 'Người dùng',
        user_filter_placeholder: 'Lọc người dùng...',
        user_new_user_btn: 'Tạo mới',
        user_status_all: 'Tất cả trạng thái',
        user_table_username: 'Tên đăng nhập',
        user_table_full_name: 'Họ và Tên',
        user_table_email: 'Email',
        user_table_status: 'Trạng thái',
        user_table_action: 'Thao tác',
        user_table_action_edit: 'Chỉnh sửa',
        user_table_action_lock: 'Khóa',
        user_table_action_unlock: 'Mở khóa',
        user_table_action_logout: 'Đăng xuất',
        user_new_user_modal_title: 'Tạo mới người dùng',
        user_new_user_modal_desc: 'Tạo mới người dùng trên hệ thống',
        user_edit_modal_title: 'Chỉnh sửa người dùng',
        user_edit_modal_desc: 'Chỉnh sửa thông tin người dùng'
      }
    }
  })

  vueApp.use(i18n)
})