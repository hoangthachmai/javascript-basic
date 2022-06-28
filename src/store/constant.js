export const gridSpacing = 3;
export const drawerWidth = 320;
export const drawerWidthIcon = 120;
export const vibEndpoints = {
  authenticate: '/Primary/?FlowAlias=hnn_api_authenticate_booking&action=api',
  login: '/Primary/?FlowAlias=portal_api_sgin_sign_in&action=api',
  home: '/Primary/?FlowAlias=portal_api_home_get_home_page&outputtype=RawJson&action=api',
  menu: '/Primary/?FlowAlias=portal_api_home_get_menu&outputtype=RawJson&action=api',
  get_project_list: '/Primary/?FlowAlias=hnn_booking_api_get_menu_project&action=api',
  get_folders: '/Primary/?FlowAlias=hnn_booking_api_get_menu_tree&action=api',

  get_mentor_detail: '/Primary/?FlowAlias=hnn_api_booking_get_mentor_detail_by_id&action=api',

  //booking
  get_all_booking: '/Primary/?FlowAlias=hnn_api_booking_get_all_booking&action=api',
  get_handle_booking: '/Primary/?FlowAlias=hnn_api_booking_get_all_handle_booking&action=api',
  get_cancel_booking: '/Primary/?FlowAlias=hnn_api_booking_get_all_cancel_booking&action=api',
  get_completed_booking:
    '/Primary/?FlowAlias=hnn_api_booking_get_all_completed_bookings&action=api',
  get_by_date_booking: '/Primary/?FlowAlias=hnn_api_booking_get_all_booking_by_date&action=api',
  get_by_mentor_booking: '/Primary/?FlowAlias=hnn_api_booking_get_all_booking&action=api',
  get_booking_detail: '/Primary/?FlowAlias=hnn_api_booking_get_detail_booking&action=api',
  set_booking_status: '/Primary/?FlowAlias=hnn_api_booking_set_booking_status&action=api',
  update_booking: '/Primary/?FlowAlias=hnn_api_booking_update_booking_information&action=api',
  cancel_booking: '/Primary/?FlowAlias=hnn_api_booking_cancel_booking&action=api',
  review_booking: '/Primary/?FlowAlias=hnn_api_booking_review_booking&action=api',
};
export const apiDomain = 'https://upload.truebpm.vn';
// export const apiDomain = 'http://localhost:4000'
export const apiEndpoints = {
  upload: '/upload',
};

export const bookingActions = {
  all_list: 'HNN_ACTION_OPEN_BOOKING_LIST',
  handle_list: 'HNN_ACTION_OPEN_HANDLE_BOOKING_LIST',
  cancel_list: 'HNN_ACTION_OPEN_CANCEL_BOOKING_LIST',
  completed_list: 'HNN_ACTION_OPEN_COMPLETED_BOOKING_LIST',
  by_date_list: 'HNN_ACTION_OPEN_DATE_BOOKING_LIST',
  by_mentor_list: 'HNN_ACTION_OPEN_MENTOR_STATISTIC_LIST',
};

export const tinyMCESecretKey = '7kiqm5c7crs3mdgf1lgiq973xn7kdxtf6ohasxhmkb2mpc45';
export const pageUrls = {
  dashboard: '/dashboard/default',
};
export const showRootFolder = false;

export const view = {
  floating: {},
  booking: {
    list: {
      cancel: 'BOOKING_LIST_CANCEL_MENU_BUTTON',
      review: 'BOOKING_LIST_REVIEW_MENU_BUTTON',
      handled: 'BOOKING_LIST_HANDLED_MENU_BUTTON',
    },
    detail: {
      save: 'BOOKING_DETAIL_SAVE_FORM_BUTTON',
    },
  },
};
