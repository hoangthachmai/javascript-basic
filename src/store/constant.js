export const gridSpacing = 3;
export const drawerWidth = 320;
export const drawerWidthIcon = 120;
export const vibEndpoints = {
  authenticate: '/Primary/?FlowAlias=hnn_api_authenticate&action=api',
  login: '/Primary/?FlowAlias=portal_api_sgin_sign_in&action=api',
  home: '/Primary/?FlowAlias=portal_api_home_get_home_page&outputtype=RawJson&action=api',
  menu: '/Primary/?FlowAlias=portal_api_home_get_menu&outputtype=RawJson&action=api',
  get_project_list: '/Primary/?FlowAlias=hnn_api_get_menu_project_list&action=api',
  get_folders: '/Primary/?FlowAlias=hnn_api_get_folder_tree_by_project&action=api',

  get_mentor_detail: '/Primary/?FlowAlias=hnn_api_cons_get_consultant_detail&action=api',

  //booking
  get_draft_booking: '/Primary/?FlowAlias=hnn_api_booking_get_all_draft_booking&action=api',
  get_reviewed_booking: '/Primary/?FlowAlias=hnn_api_booking_get_all_reviewed_booking&action=api',
  get_completed_booking: '/Primary/?FlowAlias=hnn_api_booking_get_all_completed_booking&action=api',
  get_booking_detail: '/Primary/?FlowAlias=hnn_api_booking_get_booking_detail_by_id&action=api',
  set_booking_status: '/Primary/?FlowAlias=hnn_api_booking_set_booking_status&action=api',
  update_booking: '/Primary/?FlowAlias=hnn_api_booking_update_booking&action=api',
};
export const apiDomain = 'https://upload.truebpm.vn';
// export const apiDomain = 'http://localhost:4000'
export const apiEndpoints = {
  upload: '/upload',
};

export const bookingActions = {
  draft_list: 'BOOKING_LIST_OPEN_DRAFT_ACTION',
  reviewed_list: 'BOOKING_LIST_OPEN_REVIEWED_ACTION',
  completed_list: 'BOOKING_LIST_OPEN_COMPLETED_ACTION',
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
      recall: 'BOOKING_LIST_RECALL_MENU_BUTTON',
      approve_pending: 'BOOKING_LIST_APPROVE_PENDING_MENU_BUTTON',
      submit: 'BOOKING_LIST_SUBMIT_MENU_BUTTON',
    },
    detail: {
      back: 'BOOKING_DETAIL_CLOSE_FORM_BUTTON',
      save: 'BOOKING_DETAIL_SAVE_FORM_BUTTON',
    },
  },
};
