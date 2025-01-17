import React from 'react';
import PropTypes from 'prop-types';
import {
  FormattedDate,
  FormattedMessage,
  FormattedRelativeTime,
  FormattedTime,
} from '@edx/frontend-platform/i18n';
import { Alert } from '@edx/paragon';
import { Info } from '@edx/paragon/icons';

import { useModel } from '../../generic/model-store';

const DAY_SEC = 24 * 60 * 60; // in seconds
const DAY_MS = DAY_SEC * 1000; // in ms
const YEAR_SEC = 365 * DAY_SEC; // in seconds

const CourseStartAlert = ({ payload }) => {
  const {
    courseId,
  } = payload;

  const {
    start: startDate,
    userTimezone,
  } = useModel('courseHomeMeta', courseId);

  const timezoneFormatArgs = userTimezone ? { timeZone: userTimezone } : {};

  const delta = new Date(startDate) - new Date();
  const timeRemaining = (
    <FormattedRelativeTime
      key="timeRemaining"
      value={delta / 1000}
      numeric="auto"
      updateIntervalInSeconds={YEAR_SEC}
      {...timezoneFormatArgs}
    />
  );
  if (delta < DAY_MS) {
    return (
      <Alert variant="info" icon={Info}>
        <FormattedMessage
          id="learning.outline.alert.start.short"
          defaultMessage="Course starts {timeRemaining} at {courseStartTime}."
          description="Used when the time remaining is less than a day away."
          values={{
            courseStartTime: (
              <FormattedTime
                key="courseStartTime"
                day="numeric"
                month="short"
                year="numeric"
                timeZoneName="short"
                value={startDate}
                {...timezoneFormatArgs}
              />
            ),
            timeRemaining,
          }}
        />
      </Alert>
    );
  }

  return (
    <Alert variant="info" icon={Info}>
      <strong>
        <FormattedMessage
          id="learning.outline.alert.end.long"
          defaultMessage="Энэ курс {courseStartDate} дуусна."
          description="Used when the time remaining is more than a day away."
          values={{
            courseStartDate: (
              <FormattedDate
                key="courseStartDate"
                day="numeric"
                month="numeric"
                year="numeric"
                value={startDate}
                {...timezoneFormatArgs}
              />
            ),
            timeRemaining,
          }}
        />
      </strong>
      <br />
      <FormattedMessage
        id="learning.outline.alert.end.calendar"
        defaultMessage="Don’t forget to add a calendar reminder!"
        description="It's just a recommendation for learners to set a reminder for the course starting date and is shown when the course starting date is more than a day. "
      />
    </Alert>
  );
};

CourseStartAlert.propTypes = {
  payload: PropTypes.shape({
    courseId: PropTypes.string,
  }).isRequired,
};

export default CourseStartAlert;
