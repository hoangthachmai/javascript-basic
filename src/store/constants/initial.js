import { dateOfWeek, timeWorking, workingType } from './time'

export const mentorDisplayOptions = {
  fullname: true,
  email_address: true,
  number_phone: true,
  career: true,
  rating: true,
  status: true,
  active: true,
}

export const userAvatar = 'https://obs.multicampus.vn/wp-content/uploads/2019/01/avatar.png';

export const initMentorData = {
  fullname: "",
  email_address: "",
  phone: "",
  title: "",
  description: "",
  image_url: "",
  career: "",
  advise: [],
  fb_url: "",
  linkedIn_url: "",
  is_active: false,
  short_address: "",
  experience: "",
  degree: "",
  short_address: '',
  alumnus: '',
  gender: '',
  vacation_start: '',
  vacation_end: '',
  workday: []
}

export const genderList = [
  'Nam',
  'Nữ'
]

export const initWorkingDay = {
  "day": '',
  "hour": '',
  "is_active": false,
  "type": '',
  "id": '',
}

