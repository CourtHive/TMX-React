import { matchesList } from 'engineFactory/pdfEngine/matches/matchesList';

function pdfMatchList(directive) {
  return new Promise((resolve) => {
    const { images } = directive;
    const { logo } = images && images.logo;
    const { tournament, team, type, pending_matches, completed_matches } = directive.props;
    const { docDefinition } = matchesList({
      images,
      tournament,
      pending_matches,
      completed_matches,
      team,
      type,
      logo
    });
    resolve(docDefinition);
  });
}

export const matchListGenerator = {
  'example list': pdfMatchList
};

export default matchListGenerator;
