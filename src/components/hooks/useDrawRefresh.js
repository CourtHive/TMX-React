import { useSelector } from 'react-redux';

export function useDrawRefresh({drawId}) {
    /*
    const tournamentEvents = tournamentRecord.events || [];
    const tournamentDraws = tournamentEvents.map(event => event.drawDefinitions).flat().filter(f=>f);
    const drawExists = drawId && tournamentDraws.reduce((p, c) => c.drawId === drawId ? c : p, undefined);
    const firstDraw = tournamentDraws.length && tournamentDraws[0].drawId;
    const targetDraw = (drawExists && drawId) || firstDraw;
    const drawDefinition = tournamentDraws.reduce((p, c) => c.drawId === targetDraw ? c : p, undefined) || {};
    */

    const drawResize = useSelector(state => state.tmx.drawResize);

    console.log('drawRefresh', {drawResize});
}
