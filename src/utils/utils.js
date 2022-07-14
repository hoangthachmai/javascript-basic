import { bookingActions, vibEndpoints ,accountActions } from '../store/constant.js';

export function getUrlByAction(selectedFolder) {
  switch (selectedFolder ? selectedFolder.action : '') {
    case bookingActions.all_list: {
      return vibEndpoints.get_all_booking;
    }
    case bookingActions.handle_list: {
      return vibEndpoints.get_handle_booking;
    }
    case bookingActions.cancel_list: {
      return vibEndpoints.get_cancel_booking;
    }
    case bookingActions.completed_list: {
      return vibEndpoints.get_completed_booking;
    }
    case bookingActions.by_date_list: {
      return vibEndpoints.get_by_date_booking;
    }
    case bookingActions.by_mentor_list: {
      return vibEndpoints.get_by_mentor_booking;
    }
    case accountActions.list_active_user: {
      return vibEndpoints.get_all_account;
    }
    case accountActions.list_inactive_user: {
      return vibEndpoints.get_all_inaccount;
    }
    
    default: {
      return '';
    }
  }
}

export function getUpdateUrlByAction(selectedFolder) {
  switch (selectedFolder ? selectedFolder.action : '') {
    default: {
      return '';
    }
  }
}
