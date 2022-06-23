import { bookingActions, vibEndpoints } from '../store/constant.js';

export function getUrlByAction(selectedFolder) {
  switch (selectedFolder ? selectedFolder.action : '') {
    case bookingActions.draft_list: {
      return vibEndpoints.get_draft_booking;
    }
    case bookingActions.reviewed_list: {
      return vibEndpoints.get_reviewed_booking;
    }
    case bookingActions.completed_list: {
      return vibEndpoints.get_completed_booking;
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
