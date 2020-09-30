import { hashId } from 'functions/strings';

import { fixtures, utilities } from 'tods-competition-factory';
const { countries } = fixtures;
const { dateTime } = utilities;
const { offsetDate } = dateTime;

export const googleSheets = (function () {
  const fx = {};

  fx.identifySheetType = (rows) => {
    if (!rows || !rows.length) return undefined;
    const keys = Object.keys(rows[0]).map((k) => k.toLowerCase());
    if (!keys.length) return;

    const fullName = ['fullname'].filter((k) => keys.indexOf(k) >= 1).length === 1;
    const player_name = ['first', 'last', 'firstname', 'lastname'].filter((k) => keys.indexOf(k) >= 0).length === 2;
    const player_gender = ['gender', 'sex'].filter((k) => keys.indexOf(k) >= 0).length;
    const player_birth = ['birth', 'birthdate', 'birthday', 'dateofbirth'].filter((k) => keys.indexOf(k) >= 0).length;
    const utr_roster = ['name', 'utr', 'event'].filter((k) => keys.indexOf(k) >= 0).length === 3;

    if (fullName || player_name || player_gender || player_birth || utr_roster) return 'players';
  };

  fx.processSheetPlayers = (rows) => {
    const players = [];
    const iocCodes = countries.filter((c) => c.ioc);
    const code_by_country = Object.assign({}, ...iocCodes.map((c) => ({ [compressName(c.label)]: c.ioc })));
    const iocs = iocCodes.map((c) => c.ioc.toLowerCase());

    rows.forEach((row) => {
      const player = {};
      const fullName = findAttr(row, ['Full Name']);
      player.firstName = findAttr(row, ['First', 'First Name']);
      player.lastName = findAttr(row, ['Last', 'Last Name']);
      if (fullName && fullName.split(' ').length > 1 && (!player.firstName || !player.lastName)) {
        const parts = fullName.split(' ');
        const i = parts.length <= 3 ? 1 : 2;
        player.firstName = parts.slice(0, i).join(' ');
        player.lastName = parts.slice(i).join(' ');
      }

      const name = findAttr(row, ['Name']);
      if (name && (!player.firstName || !player.lastName)) {
        const names = name.split(' ');
        if (names.length >= 2) {
          player.firstName = names.slice(0, names.length - 1).join(' ');
          player.lastName = names[names.length - 1];
        }
      }

      player.name = fullName || `${player.firstName} ${player.lastName}`;

      if (!player.firstName || !player.lastName) return;

      player.emailAddress = findAttr(row, ['e-mail', 'emailAddress']);

      const telephone = findAttr(row, ['telephone', 'Phone Number', "Player's Phone Number", 'Handphone Number']);
      const contains_phone = attrContains(row, ['phone', 'Phone Number', "Player's Phone Number", 'Handphone Number']);
      player.telephone = telephone || contains_phone;

      player.city = findAttr(row, ['City']);
      player.state = findAttr(row, ['State']);

      const otherName = findAttr(row, ['Nickname']);
      if (otherName) player.otherName = otherName;

      const club_code = findAttr(row, ['Club Code']);
      const club_name = findAttr(row, ['Club Name']);
      player.club_code = club_code || '';
      player.club_name = club_name || '';

      const school = findAttr(row, ['School', 'College']);
      player.school = school || '';

      player.profile = findAttr(row, [
        'Profile',
        'UTR Profile',
        'UTR Player Profile Link',
        "Player's UTR Profile Link"
      ]);
      player.location = findAttr(row, ['Location']);
      player.rank = findAttr(row, ['Rank', 'Ranking']);

      const parenthetical = /\((.*)\)/;
      if (player.school && player.school.match(parenthetical)) {
        player.school_abbr = player.school.match(parenthetical)[1];
      }

      player.school_abbr = findAttr(row, ['School Abbreviation', 'School Abbr', 'School Code']);

      const gender_value = findAttr(row, ['Gender', 'Sex', "Player's Gender"]);
      const sex = (gender_value && gender_value.toLowerCase()) || '';
      if (['male', 'man', 'm', 'b', 'boy'].indexOf(sex) >= 0) player.sex = 'M';
      if (['female', 'w', 'f', 'g', 'girl', 'woman'].indexOf(sex) >= 0) player.sex = 'F';

      const ioc = findAttr(row, ['IOC']);
      if (ioc) player.ioc = ioc;

      const country = findAttr(row, ['Country', 'Nationality']);
      if (country) {
        player.ioc =
          iocs.indexOf(country.toLowerCase()) >= 0 ? country.toLowerCase() : code_by_country[compressName(country)];
      }

      const birth = findAttr(row, [
        'Birth',
        'Birthdate',
        'Birthday',
        'Birth Date',
        'Date of Birth',
        "Player's Birthdate"
      ]);
      if (birth) {
        const birthdate = offsetDate(birth);
        player.birth = [birthdate.getFullYear(), birthdate.getMonth() + 1, birthdate.getDate()].map(zeroPad).join('-');
      }

      const hashuuid = hashId(`${player.firstName}${player.lastName}`);

      const id_row = findAttr(row, ['ID']);
      const submission_id = findAttr(row, ['Submission ID']);
      const id = id_row && id_row.indexOf('google') < 0 ? id_row : submission_id ? `GS${submission_id}` : undefined;
      player.id = findAttr(row, ['UUID', 'Unique ID', 'Uniquie Identifier']) || id || hashuuid;

      const ratings = getRatings(row);
      Object.assign(player, ratings);
      // processRatings(player);

      players.push(player);
    });

    function getRatings(row) {
      const headers = [
        { attr: 'rating_utr_singles', header: 'Verified SinglesUtr' },
        { attr: 'rating_utr_singles', header: 'Rating', sheet_name: 'Matched Players' },
        { attr: 'rating_utr_singles', header: 'UTR' },
        { attr: 'rating_utr_singles_status', header: 'Verified SinglesUtr Status' },
        { attr: 'rating_utr_singles_status', header: 'RatingStatus' },
        { attr: 'rating_utr_doubles', header: 'Verified DoublesUtr' },
        { attr: 'rating_utr_doubles', header: 'DoublesRating', sheet_name: 'Matched Players' },
        { attr: 'rating_utr_doubles_status', header: 'Verified DoublesUtr Status' },
        { attr: 'rating_utr_doubles_status', header: 'RatingStatusDoubles' }
      ];
      const attributes = Object.assign(
        {},
        ...headers
          .map((obj) => {
            const value = findAttr(row, [obj.header]);
            return value ? { [obj.attr]: value } : false;
          })
          .filter((f) => f)
      );
      return attributes;
    }
    function compressName(name) {
      return name.split(' ').join('').toLowerCase();
    }

    function findAttr(row, attrs = []) {
      const attributes = attrs.concat(...attrs.map((attr) => attr.toLowerCase().split(' ').join('')));
      return attributes.reduce((p, c) => row[c] || p, undefined);
    }

    function attrContains(row, attrs = []) {
      const attributes = attrs.concat(...attrs.map((attr) => attr.toLowerCase().split(' ').join('')));
      const possible = Object.keys(row)
        .filter((header) => attributes.reduce((p, c) => (header.indexOf(c) >= 0 ? c : p), undefined))
        .map((p) => row[p]);
      return possible && possible.length ? possible[0] : undefined;
    }

    const participants = players.map((player) => ({
      name: player.name,
      participantId: player.id,
      person: {
        personId: player.id,
        sex: player.sex,
        standardGivenName: player.firstName,
        standardFamilyName: player.lastName,
        nationalityCode: player.ioc
      }
    }));

    return { players, participants };
  };

  function zeroPad(number) {
    return number.toString()[1] ? number : '0' + number;
  }

  return fx;
})();
