import { env } from 'config/defaults';
import { coms } from 'services/communications/SocketIo/coms';
import { eventConstants, participantRoles, participantTypes } from 'tods-competition-factory';

const { COMPETITOR } = participantRoles;
const { INDIVIDUAL } = participantTypes;

const legacyRatingCategories = ['UTR', 'WTN', 'UTR-D', 'WTN-D', 'NTRP', 'ELO'];

/*
To use JSONpath
import { JSONPath } from 'jsonpath-plus'

JSONPath({json: tournamentRecord, path: '$...matchUps'}).flat()
*/

export const versionCheck = (function () {
  const fx = {};

  const versionUpdates = {
    '1.0': [],
    1.1: ['removeAncestors'],
    1.2: ['purgeAttributes'], // purgeAttributes can appear again later if extended
    1.4: ['participantsArray', 'tournamentTwoOh'],
    1.5: ['sexedPersons'],
    1.6: ['TODS08'],
    1.7: ['t1aEvents', 't1aCategories', 't1aTournamentId']
  };

  fx.tournament = (t, forceUpdate) => {
    if (!t) return;
    const formatVersionTMX = parseFloat(env.formatVersion);
    const tournamentVersion = forceUpdate ? 1 : identifyTournamentVersion(t);
    if (tournamentVersion < formatVersionTMX) {
      console.log('%c Updating Format Version', 'color: yellow');
      const versions = Object.keys(versionUpdates).filter(
        (v) => parseFloat(v) <= formatVersionTMX && parseFloat(v) > tournamentVersion
      );
      versions.forEach((version) => {
        let updateMethodCount = 0;
        let updatesApplied = 0;
        const updates = versionUpdates[version] || [];
        updates.forEach((update) => {
          let applied;
          updateMethodCount += 1;
          if (typeof fx[update] === 'function') {
            ({ t, applied } = fx[update](t));
            if (applied) updatesApplied += 1;
          }
        });

        if (updateMethodCount === updatesApplied) {
          t = updateTournamentVersion(t, version);
        }
      });
      checkParsing(t);
    }

    // this needs to be moved to a version update...
    if (t.reg_link) {
      t.registration.registered = t.reg_link;
      delete t.reg_link;
    }

    return t;
  };

  function checkParsing(t) {
    const stringifies = JSON.stringify(t);
    if (!stringifies) {
      const tournamentId = t.unifiedTournamentId?.tournamentId || t.tournamentId;
      coms.emitTmx({ notice: `Stringification error TUID: ${tournamentId}` });
    }
  }

  fx.removeAncestors = (t) => {
    (t.events || []).forEach((e) => deleteWalk(e, 'ancestor'));
    return { t, applied: true };
  };

  fx.purgeAttributes = (t) => {
    (t.events || []).forEach(purgeEventAttributes);
    return { t, applied: true };
  };

  fx.tournamentTwoOh = (t) => {
    console.log('%c updating tournament to 2.0', 'color: lightgreen');
    if (t.tournamentName && !t.name) {
      t.name = t.tournamentName;
    }
    if (t.name && !t.tournamentName) {
      t.tournamentName = t.name;
    }
    if (t.start) {
      t.startDate = t.start;
      delete t.start;
    }
    if (t.end) {
      t.endDate = t.end;
      delete t.end;
    }
    (t.events || []).forEach((event) => {
      if (event.draws && !event.drawDefinitions) {
        event.drawDefinitions = event.draws;
        delete event.draws;
      }
      if (!event.eventName && event.name) {
        event.eventName = event.name;
        delete event.name;
      }
    });
    return { t, applied: true };
  };

  fx.participantsArray = (t) => {
    if (t.players && !t.participants) {
      console.log('%c Applying 2.0 Participants Update', 'color: lightblue');
      t.participants = t.players.map((player) => ({
        participantId: player.id,
        participantType: INDIVIDUAL,
        participantRole: COMPETITOR,
        name: `${player.last_name}, ${player.first_name}`,
        person: {
          personId: player.id,
          sex: player.sex || player.gender,
          standardFamilyName: player.last_name,
          standardGivenName: player.first_name,
          nationalityCode: player.ioc
        }
      }));
    }
    return { t, applied: true };
  };

  fx.sexedPersons = (t) => {
    (t.participants || []).forEach((participant) => {
      if (participant.person && !participant.person.sex) {
        participant.person.sex = participant.person.gender;
        delete participant.person.gender;
      }
    });
    return { t, applied: true };
  };

  fx.TODS08 = (t) => {
    (t.participants || []).forEach((participant) => {
      const { person } = participant;
      if (person) {
        if (!person.standardFamilyName) person.standardFamilyName = person.preferredFamilyName;
        if (!person.standardGivenName) person.standardGivenName = person.preferredGivenName;
        delete participant.person.preferredFamilyName;
        delete participant.person.preferredGivenName;
      }
    });
    return { t, applied: true };
  };

  fx.t1aTournamentId = (t, applied) => {
    if (!t.unifiedTournamentId?.organisation) {
      t.unifiedTournamentId = {
        tournamentId: t.tournamentId || t.unifiedTournamentId?.tournamentId,
        organisation: {
          organisationAbbreviation: t.org?.abbr,
          organisationName: t.org?.name,
          organisationId: t.org?.ouid
        }
      };
    }

    if (env.org?.ouid && !t.unifiedTournamentId?.organisation?.organisationId) {
      t.unifiedTournamentId.organisation.organisationId = env.org.ouid;
      if (!t.unifiedTournamentId.organisation.organisationAbbreviation) {
        t.unifiedTournamentId.organisation.organisationAbbreviation = env.org.abbr;
      }
      if (!t.unifiedTournamentId.organisation.organisationName) {
        t.unifiedTournamentId.organisation.organisationName = env.org.name;
      }
    }

    // tournament.tournamentId still needs to be present for Dexie...

    return { t, applied };
  };

  fx.t1aEvents = (t, applied) => {
    if (!t.events) t.events = [];
    if (t.Events) t.events = t.Events;
    delete t.Events;

    return { t, applied };
  };

  fx.t1aCategories = (t, applied) => {
    if (!t.tournamentCategories) t.tournamentCategories = [];

    const legacyCategories = t.categories || [];
    legacyCategories.forEach((legacyCategory) => {
      const tournamentCategoryNames = t.tournamentCategories.map((category) => category.categoryName);
      if (tournamentCategoryNames.includes(legacyCategory)) {
        return;
      } else {
        const type = legacyRatingCategories.includes(legacyCategory) ? eventConstants.RATING : eventConstants.AGE;
        const tournamentCategory = { categoryName: legacyCategory, type };
        t.tournamentCategories.push(tournamentCategory);
      }
    });

    (t.events || []).forEach((event) => {
      if (!event.category) event.category = {};
      if (event.ageCategory) {
        event.category.categoryName = event.ageCategory;
        const type = legacyRatingCategories.includes(event.ageCategory) ? eventConstants.RATING : eventConstants.AGE;
        event.category.type = type;
        console.log({ category: event.category });
      }
      if (event.ratingsCategory) {
        event.category.categoryName = event.ratingsCategory.rating;
        event.category.type = eventConstants.RATING;
        console.log({ category: event.category });
      }
      if (!event.category.categoryName) {
        event.category.categoryName = 'ALL';
        event.category.type = eventConstants.AGE;
      }
      delete event.ageCategory;
      delete event.ratingsCategory;
    });

    delete t.categories;

    return { t, applied };
  };

  function updateTournamentVersion(t, version) {
    if (!t) return;
    if (!t.metadata) t.metadata = {};
    t.metadata.formatVersion = version;
    return t;
  }

  function identifyTournamentVersion(t) {
    const formatVersion = t?.dataStandardsVersion || t?.metadata?.formatVersion || 0;
    return parseFloat(formatVersion);
  }

  function deleteWalk(obj, what) {
    const oKeys = Object.keys(obj);
    oKeys.forEach((k) => {
      if (k === what) {
        delete obj[k];
      } else {
        const ko = obj[k];
        if (ko && typeof ko === 'object' && typeof ko !== 'function') {
          deleteWalk(ko, what);
        }
      }
    });
  }

  function purgeEventAttributes(e) {
    const attributes = ['broadcast_name'];
    attributes.forEach((attr) => delete e[attr]);
  }

  return fx;
})();
