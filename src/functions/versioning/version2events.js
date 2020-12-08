import { unique } from '../arrays';

import { UUID } from '../UUID';
import i18n from 'i18next';

export function version2events(sourceEvents) {
  const genders = {
    M: i18n.t('genders.male').toUpperCase(),
    F: i18n.t('genders.female').toUpperCase(),
    W: i18n.t('genders.female').toUpperCase(),
    X: i18n.t('genders.mixed').toUpperCase()
  };

  const formats = {
    S: i18n.t('formats.singles').toUpperCase(),
    D: i18n.t('formats.doubles').toUpperCase(),
    T: i18n.t('formats.team').toUpperCase()
  };

  function getCategory(category) {
    return (category && category.toUpperCase()) || 'ALL';
  }
  function getGender(gender) {
    return (gender && genders[gender.toUpperCase()]) || 'MIXED';
  }
  function getEventType(e) {
    return (e && [getGender(e.gender || 'X'), getCategory(e.category), getFormat(e.format)].join('|')) || 'UNDEFINED';
  }
  function getFormat(format) {
    return (format && formats[format.toUpperCase()]) || 'SINGLES';
  }

  const eventTypes = unique(sourceEvents.map(getEventType)) || [];

  const eventDraws = Object.assign({}, ...eventTypes.map((et) => ({ [et]: [] })));
  sourceEvents.forEach((se) => {
    const eventType = getEventType(se);
    eventDraws[eventType].push(se);
  });

  const getEntries = (draws) => {
    const approved = unique([].concat(...draws.map((d) => [].concat(...(d.approved || [])))));
    return approved.map((a) => ({ participant: { participantId: a } }));
  };
  const eventAttributes = (key) => {
    const draws = eventDraws[key];
    const firstEvent = draws[0];
    const entries = getEntries(draws);
    return {
      key,
      entries,
      eventId: UUID.generate(),
      name: key.split('|').join(' '),
      rank: firstEvent.rank,
      indoorOutdoor: firstEvent.indoorOutdoor,
      surfaceCategory: firstEvent.surfaceCategory,
      category: firstEvent.category,
      gender: firstEvent.gender,
      format: firstEvent.format
    };
  };

  const eventDrawIds = (key) => {
    const legacyEvents = eventDraws[key].map((e) => e.euid);
    return legacyEvents;
  };

  const targetEvents = Object.keys(eventDraws).map((key) => {
    const attributes = eventAttributes(key);
    const draws = eventDrawIds(key);
    attributes.draws = draws;
    return attributes;
  });

  return targetEvents;
}
