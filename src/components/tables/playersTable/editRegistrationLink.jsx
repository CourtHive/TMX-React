import i18n from 'i18next';
import { defineLink } from 'components/forms/linkEntry/linkEntry';
import { fetchGoogleSheet } from 'services/communications/Axios/fetch/fetchGoogleSheet';

export const editRegistrationLink = (props) => {
  const { tournamentProfile } = props;
  const callback = (url) => {
    fetchGoogleSheet({ url });
  };
  const { participantSource } = tournamentProfile || {};
  const { url: link } = participantSource || { url: '' };
  defineLink({
    link,
    validate: true,
    prompt: 'https://docs.google.com/spreadsheets/d/...',
    title: i18n.t('Enter Google Sheet Link'),
    callback
  });
};
