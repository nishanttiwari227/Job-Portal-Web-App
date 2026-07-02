const JOB_STATUSES = {
  DRAFT: 'draft',
  OPEN: 'open',
  CLOSED: 'closed',
  ARCHIVED: 'archived',
};

const JOB_TYPES = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
  TEMPORARY: 'temporary',
};

const WORK_MODES = {
  REMOTE: 'remote',
  HYBRID: 'hybrid',
  ONSITE: 'onsite',
};

const EXPERIENCE_LEVELS = {
  ENTRY: 'entry',
  MID: 'mid',
  SENIOR: 'senior',
  LEAD: 'lead',
  MANAGER: 'manager',
};

const JOB_TYPES_ARRAY = Object.values(JOB_TYPES);
const WORK_MODES_ARRAY = Object.values(WORK_MODES);
const EXPERIENCE_LEVELS_ARRAY = Object.values(EXPERIENCE_LEVELS);
const JOB_STATUSES_ARRAY = Object.values(JOB_STATUSES);

export {
  JOB_STATUSES,
  JOB_STATUSES_ARRAY,
  JOB_TYPES,
  JOB_TYPES_ARRAY,
  WORK_MODES,
  WORK_MODES_ARRAY,
  EXPERIENCE_LEVELS,
  EXPERIENCE_LEVELS_ARRAY,
};
