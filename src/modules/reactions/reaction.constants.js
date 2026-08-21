const REACTION_TYPES = ['+1', '👏', '🔥'];

// Keep protocol values explicit so they cannot be corrupted by file encoding.
const VALID_REACTION_TYPES = ['+1', '\u{1F44F}', '\u{1F525}'];

module.exports = { REACTION_TYPES: VALID_REACTION_TYPES };
