import { fixtures } from 'tods-competition-factory';
const { flagIOC } = fixtures;

export default class ParticipantData {
  constructor({ participants, info, options, roundWidth, nextUnfilledDrawPositions } = {}) {
    this._nextUnfilledDrawPositions = nextUnfilledDrawPositions || [];
    this._participants = participants || [];
    this._roundWidth = roundWidth;
    this._options = options || {};
    this._info = info || {};
  }

  set participants(participants) {
    this._participants = participants || [];
  }

  set nextUnfilledDrawPositions(nextUnfilledDrawPositions) {
    this._nextUnfilledDrawPositions = nextUnfilledDrawPositions || [];
  }

  set info(info) {
    this._info = info || {};
  }
  set roundWidth(rl) {
    this._roundWidth = rl;
  }
  get count() {
    return this._participants.length;
  }

  find(d, side = 0) {
    const data = d && d.data;
    if (!data || typeof data !== 'object') return '';

    const sides = data.Sides;
    const winningSide = data.winningSide;
    const matchUpId = data.matchUpId;
    const isByeMatchUp = sides && sides.filter((f) => f).reduce((p, c) => c.bye || p, false);
    const byeAdvancedSide = isByeMatchUp && sides.reduce((p, c, i) => (c.participantId ? i + 1 : p), undefined);
    const advancedSide = winningSide || byeAdvancedSide;
    const Side = matchUpId && sides && advancedSide !== undefined && sides[advancedSide - 1];
    const participantId = (Side && Side.participantId) || data.participantId;
    if (!participantId) return '';

    const seedValue = Side ? Side.seedValue || Side.seedNumber : data.seedValue || data.seedNumber;
    const participant = data.participantId ? data.participant : Side.participant;
    const isTeam = participant && participant.participantType === 'TEAM';
    const attributes = { seedValue, isTeam };

    let opponent;
    if (participant) {
      if (participant.person && side === 0) {
        opponent = Object.assign({}, participant, attributes);
      } else if (participant.participantType === 'TEAM') {
        opponent = Object.assign({}, participant, attributes);
      } else if (participant.participantType === 'PAIR') {
        opponent = Object.assign({}, participant.individualParticipants[side], attributes);
      }
    }

    return { opponent, side, isTeam };
  }

  hashCode(d) {
    const { opponent } = this.find(d);
    const participantId = opponent && opponent.participantId;
    if (participantId) {
      let hash = 0;
      if (participantId.length === 0) {
        return hash;
      }
      for (let i = 0; i < participantId.length; i++) {
        const char = participantId.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return hash;
    }
  }

  drawPosition(d) {
    const { opponent } = this.find(d);
    if (this._info.feedIn && d.depth < this._info.maxRound) return '';
    if (!d.height && opponent && opponent.drawPosition) return opponent.drawPosition;
    const drawPosition = getDrawPosition(d);
    return !d.height && drawPosition ? drawPosition : '';
  }

  rankingRating(d, side) {
    const { opponent } = this.find(d, side);
    if (!opponent || (this._info.feedIn && d.depth < this._info.maxRound)) return '';

    let scaleValue;
    if (this._options.details.player_ratings && this._info.dataScan.player_ratings) {
      scaleValue =
        opponent.ratings && opponent.ratings[this._options.details.player_ratings]
          ? opponent.ratings[this._options.details.player_ratings].singles.value
          : '';
    } else {
      scaleValue = opponent.rank && !isNaN(opponent.rank) ? parseInt(opponent.rank.toString().slice(-4)) : '';
      if (scaleValue && opponent.int && opponent.int > 0) scaleValue = `{${opponent.int}}`;
    }
    return d.height || !scaleValue ? '' : scaleValue;
  }

  seedValue(d) {
    const { opponent } = this.find(d);
    if (!opponent || (this._info.feedIn && d.depth < this._info.maxRound)) return '';
    const seed = getSeeding({ opponent, options: this._options });
    const seedText = seed && seed.toString().length < 3 && seed;
    return d.height ? '' : seedText || '';
  }

  drawEntry(d) {
    const { opponent } = this.find(d);
    if (!opponent || (this._info.feedIn && d.depth < this._info.maxRound)) return '';
    return d.height ? '' : opponent.entry ? opponent.entry : opponent.qualifier ? 'Q' : '';
  }

  name(d, side = 0, lengthThreshold) {
    const { opponent, which, isTeam } = this.find(d, side);

    if (!opponent) {
      if (side === 0) {
        if (d && d.data && d.data.bye) {
          if (!which) return this._options.text.bye;
          if (which && this._info.hasDoubles) return this._options.text.bye;
        }
        if (d && d.data && d.data.qualifier) {
          if (!which) return this._options.text.qualifier;
          if (which && this._info.hasDoubles) return this._options.text.qualifier;
        }
      }
      return '';
    } else if (isTeam && side === 1) {
      return '';
    }

    const flags = this._options.flags.display && this._info.hasNationalities;
    const seedValue = getSeeding({ opponent, side, options: this._options });
    const seed = (seedValue && ` [${seedValue}]`) || '';

    let text;

    const person = opponent.person || {};
    const otherName = person.otherName;
    const firstName = person.standardGivenName;
    const lastName = person.standardFamilyName;
    const commaFirstName = firstName ? `, ${firstName}` : '';
    const firstInitial = firstName ? `, ${firstName[0]}` : '';
    const firstFirstName =
      firstName && firstName.split(' ').length > 1 ? `, ${firstName.split(' ')[0]}` : commaFirstName;
    const lastLastName =
      lastName && lastName.trim().split(' ').length > 1 ? lastName.trim().split(' ').reverse()[0] : lastName;
    const lastFirstI = `${lastName}${firstInitial || ''}${seed}`;
    const lastLastI = `${lastLastName}${firstInitial || ''}${seed}`;

    if (lastName) {
      text = `${lastName}${commaFirstName}${seed}`;
      if (text.length > lengthThreshold) text = `${lastName}${firstFirstName}${seed}`;
      if (this._options.names.first_initial || text.length > lengthThreshold) text = lastFirstI;
      if (text.length > lengthThreshold) text = lastLastI;
    } else {
      text = `${opponent.name}${seed}`;
    }

    if (otherName) {
      const nickname = `${otherName}${seed}`;
      if (nickname.length <= lengthThreshold) text = nickname;
    }

    if (flags) {
      const whiteFlag = String.fromCodePoint(0x1f3f3);
      const flag = this.flag(d, side) || whiteFlag;
      text = `${flag} ${text}`;
    }

    return text;
  }

  playerColor(d) {
    const { opponent } = this.find(d);
    const seeded = opponent && opponent.seedValue;
    return seeded ? this._options.seeds.color : '#000';
  }

  playerBold(d) {
    const { opponent } = this.find(d);
    if (!opponent || !this._options.names.boldSeeds) return 'normal';
    const fontWeight = opponent.seedValue ? 'bold' : 'normal';
    return fontWeight;
  }

  teamDisplay(d, side = 0, compress) {
    const { opponent } = this.find(d, side);
    let teamName = opponent && opponent.team;
    if (teamName && teamName.length > 15) teamName = `${teamName.slice(0, 12)}...`;
    const team = (!d.height && teamName) || '';
    return compress ? compressName(team) : team;
  }

  flag(d, side) {
    const { opponent } = this.find(d, side);
    const nationalityCode = opponent && opponent.person && opponent.person.nationalityCode;
    if (!nationalityCode || nationalityCode.length !== 3) return '';
    return flagIOC(nationalityCode).trim();
  }

  flagRef(d, side) {
    const { opponent } = this.find(d, side);
    if (!opponent || !opponent.ioc || opponent.ioc.length !== 3) return '';
    return `${this._options.flags.path}${opponent.ioc.toUpperCase()}.png`;
  }

  mouseOverTeam(d, i, root) {
    const { opponent } = this.find(d, i);
    const teamName = opponent && opponent.team;
    if (teamName) {
      Array.from(root.node().querySelectorAll(`[teamDisplay='${compressName(teamName)}']`)).forEach((e) => {
        e.style.fill = this._options.teams.hover_color;
      });
    }
  }

  mouseOutTeam(d, i, root) {
    const { opponent } = this.find(d, i);
    const teamName = opponent && opponent.team;
    if (teamName) {
      Array.from(root.node().querySelectorAll(`[teamDisplay='${compressName(teamName)}']`)).forEach((e) => {
        e.style.fill = 'black';
      });
    }
  }

  highlightCell(d, i, root) {
    const hashCode = this.hashCode(d);
    if (hashCode) {
      root
        .selectAll("[hid='" + hashCode + "']")
        .attr('fill', this._options.edit_fields.highlight_color)
        .attr('opacity', '.2');
    }
  }

  unHighlightCell(d, i, root) {
    const hashCode = this.hashCode(d);
    if (hashCode) {
      const opacity = this.editVisible(d, this._options.maxTreeDepth);
      root
        .selectAll("[hid='" + hashCode + "']")
        .attr('fill', this._options.edit_fields.color)
        .attr('opacity', opacity);
    }
  }

  scoreState(d) {
    return this.editVisible(d, this._info.maxRound) > 0 ? 'true' : 'false';
  }

  editVisible(d) {
    if (!d.data) return 0;
    const drawPosition = d.data.drawPosition;
    const unfilledDrawPosition = drawPosition && this._nextUnfilledDrawPositions.includes(drawPosition);
    const readyToScore = d.data.readyToScore && !d.data.participantId;

    return unfilledDrawPosition || readyToScore ? this._options.edit_fields.opacity : 0;
  }

  findTournamentParticipant(participantId) {
    const participant = this._participants.reduce((participant, candidate) => {
      return candidate.participantId === participantId ? candidate : participant;
    }, undefined);
    return participant;
  }
}

function getDrawPosition(d) {
  const winningSide = d.data.winningSide;
  return winningSide ? d.data.drawPositions[winningSide - 1] : d.data.drawPosition || '';
}

function getSeeding({ opponent, side, options }) {
  const seedNumber = options.names.seed_number && !side && opponent.seedValue;
  const blockSeeding = opponent.seedValue && !side && opponent.seedBlock && options.names.seedBlock;
  const blockThreshold =
    typeof blockSeeding === 'boolean' || (!isNaN(blockSeeding) && opponent.seedValue >= blockSeeding);
  const seedBlock = blockSeeding && blockThreshold && opponent.seedBlock;
  return seedBlock || seedNumber;
}

function compressName(name) {
  return name.replace(/["'., ]/g, '');
}
