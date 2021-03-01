import { postAccess } from 'services/communications/Axios/fetch/postAccess';
import { NAMESPACE } from 'constants/idioms';

export function idiomFetch({ lng, ns }) {
  const subPath = 'idioms/fetch';
  return postAccess({ params: { lng, ns }, subPath });
}

export function idiomsAvailable({ ns = NAMESPACE } = {}) {
  const subPath = 'idioms/available';
  return postAccess({ params: { ns }, subPath });
}

export function idiomsUpdated(/*{ ns } = {}*/) {
  const subPath = 'idioms/updated';
  return postAccess({ params: {}, subPath });
}
