export const plays = {
    'Serve': [{
        short: 'Ace',
        code: 'svace'
    }, {
        short: 'Attempt',
        code: 'svatt'
    }, {
        short: 'Error',
        code: 'sverr'
    }],
    'Serve Receive': [{
        short: 'Dig',
        code: 'srdig'
    }, {
        short: 'Attempt',
        code: 'sratt'
    }, {
        short: 'Error',
        code: 'srerr'
    }],
    'Defense': [{
        short: 'Dig',
        code: 'dfdig'
    }, {
        short: 'Attempt',
        code: 'dfatt'
    }, {
        short: 'Error',
        code: 'dferr'
    }],
    'Spike': [{
        short: 'Kill',
        code: 'spkll'
    }, {
        short: 'Attempt',
        code: 'spatt'
    }, {
        short: 'Error',
        code: 'sperr'
    }],
    'Block': [{
        short: 'Block',
        code: 'block'
    }, {
        short: 'Touch',
        code: 'bktch'
    }, {
        short: 'Error',
        code: 'bkerr'
    }],
    'Set': [{
        short: 'Assist',
        code: 'stast'
    }, {
        short: 'Dump',
        code: 'stdmp'
    }, {
        short: 'Error',
        code: 'sterr'
    }]
}
export const playCodes = {
    'svace': {
        title: 'Service Ace',
        play2: 'svatt'
    },
    'svatt': {
        title: 'Service Attempt'
    },
    'sverr': {
        title: 'Service Error',
        play2: 'svatt'
    },
    'srdig': {
        title: 'Serve Receive Dig',
        play2: 'sratt'
    },
    'sratt': {
        title: 'Serve Receive Attempt'
    },
    'srerr': {
        title: 'Serve Receive Error',
        play2: 'sratt'
    },
    'dfdig': {
        title: 'Defense Dig',
        play2: 'dfatt'
    },
    'dfatt': {
        title: 'Defense Attempt'
    },
    'dferr': {
        title: 'Defense Error',
        play2: 'dfatt'
    },
    'spkll': {
        title: 'Kill',
        play2: 'spatt'
    },
    'spatt': {
        title: 'Spike Attempt'
    },
    'sperr': {
        title: 'Spike Error',
        play2: 'spatt'
    },
    'block': {
        title: 'Block'
    },
    'bktch': {
        title: 'Block Touch'
    },
    'bkerr': {
        title: 'Block Error'
    },
    'stast': {
        title: 'Set Assist'
    },
    'stdmp': {
        title: 'Dump'
    },
    'sterr': {
        title: 'Set Error'
    }
}
export const statCodes = {
    'svace': 'Service Aces',
    'svatt': 'Service Attempts',
    'sverr': 'Service Errors',
    'srdig': 'Serve Receive Digs',
    'sratt': 'Serve Receive Attempts',
    'srerr': 'Serve Receive Errors',
    'dfdig': 'Defense Digs',
    'dfatt': 'Defense Attempts',
    'dferr': 'Defense Errors',
    'spkll': 'Kills',
    'spatt': 'Spike Attempts',
    'sperr': 'Spike Errors',
    'block': 'Blocks',
    'bktch': 'Block Touches',
    'bkerr': 'Block Errors',
    'stast': 'Set Assists',
    'stdmp': 'Dumps',
    'sterr': 'Set Errors'
}
export const baseStats = {
    'svace': 0,
    'svatt': 0,
    'sverr': 0,
    'srdig': 0,
    'sratt': 0,
    'srerr': 0,
    'dfdig': 0,
    'dfatt': 0,
    'dferr': 0,
    'spkll': 0,
    'spatt': 0,
    'sperr': 0,
    'block': 0,
    'bktch': 0,
    'bkerr': 0,
    'stast': 0,
    'stdmp': 0,
    'sterr': 0
}
export const excelStats = {
    'Player': '',
    'Service Aces': 0,
    'Service Attempts': 0,
    'Service Errors': 0,
    'Serve Receive Digs': 0,
    'Serve Receive Attempts': 0,
    'Serve Receive Errors': 0,
    'Defense Digs': 0,
    'Defense Attempts': 0,
    'Defense Errors': 0,
    'Kills': 0,
    'Spike Attempts': 0,
    'Spike Errors': 0,
    'Blocks': 0,
    'Block Touches': 0,
    'Block Errors': 0,
    'Set Assists': 0,
    'Dumps': 0,
    'Set Errors': 0
}