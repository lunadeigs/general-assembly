//All questions from main list pulled from computer Science jeopordies: https://jeopardylabs.com/play/computer-science-1012
//As well as just general google search data/wikipedia
const mainList = {
    'One': {
        'Software': {
            'Stores running programs and other types of data on computers': [
                'What is Memory', //Correct
                'What is A Processor',
                'What is a GPU',
                'What is a Screen'
            ]
        },
        'Data': {
            'The name given to a basic binary unit': [
                'What is a Bit',
                'What is a Byte',
                'What is a String',
                'What is an Integer'
            ]
        },
        'Operating Systems': {
            'Basic operations that are needed for the function of a computer but not built directly into the hardware': [
                'What is an Operating System',
                'What is a Computer',
                'What is Software',
                'What is Hardware'
            ]
        },
        'Computer History': {
            'Who invented the term Debugging': [
                'Who is Grace Hopper',
                'Who is Thomas Edison',
                'Who is Alan Turing',
                'Who is Tim Berners-Lee'
            ],
            'A programable electronic devise that can store, retrieve, and process data': [
                'What is a computer',
                'What is a Whiteboard',
                'What is a calculator',
                'What is a pacemaker'
            ]
        },
        'Hardware': {
            'Part of the computer that holds the Memory and CPU': [
                'What is the Motherboard',
                'What is the Processor',
                'What is the GPU',
                'What is the Harddrive'
            ]
        }
    },
    'Two': {
        'Software': {
            'Performs the math on a computer': [
                'What is the Arithmetic/Logic Unit (ALU)',
                'What is a T-Flip-flop',
                'What is an or gate',
                'What is the Processor'
            ]
        },
        'Data': {
            'The two patterns that make up the binary system': [
                'What is 0 and 1',
                'What is 1 and 2',
                'What is -1 and 1',
                'What is -1 and 0'
            ]
        },
        'Operating Systems': {
            'Doing more than 1 thing in a single program': [
                'What is multithreading',
                'What is a multicore',
                'What is multiple processors',
                'What is muliplicating'
            ]
        },
        'Computer History': {
            'The very first type of computer': [
                'What is a calculator',
                'What is a phone',
                'What is a a server',
                'What is a desktop'
            ]
        },
        'Hardware': {
            'The amount of memory that your computer can store away': [
                'What is storage capacity',
                'What is storage',
                'What is solid state storage',
                'What is hard drive storage'
            ]
        }
    },
    'Three': {
        'Software': {
            'A five step process that summarizes how computers run': [
                'What is the Fetch/Execute cycle',
                'What is the Execute cycle',
                'What is the Fetch cycle',
                'What is the program loop'
            ]
        },
        'Data': {
            'A sequence of numbers used to simplify sequences of bits': [
                'What is hexidecimal',
                'What is binary',
                'What is RGB',
                'What is ASCII'
            ]
        },
        'Operating Systems': {
            'The most widespread of all Operating Systems': [
                'What is Microsoft Windows',
                'What is MacOS',
                'What is Linux',
                'What is Unix'
            ]

        },
        'Computer History': {
            'The number of generations that computers have gone through': [
                'What is five',
                'What is four',
                'What is six',
                'What is seven'
            ]
        },
        'Hardware': {
            'Main high speed memory that holds data and instructions': [
                'What is RAM',
                'What is memory',
                'What is solid state memory',
                'What is HDD memory'
            ]
        }

    },
    'Four': {
        'Software': {
            'A computer can only perform about 100 different kinds of these': [
                'What is instructions',
                'What is commands',
                'What is code',
                'What is binary'
            ]
        },
        'Data': {
            'Taking measurements at regular intervals when digitizing sound': [
                'What is sampling',
                'What is testing',
                'What is penetration testing',
                'What is experimentation'
            ]
        },
        'Operating Systems': {
            'When more than 1 CPU is running at 1 time': [
                'What is multiprocessing',
                'What is multithreading',
                'What is multicoring',
                'What is multimemory'
            ]
        },
        'Computer History': {
            'The generation in which the internet was first used': [
                'What is the fourth generation',
                'What is the third generation',
                'What is the second generation',
                'What is the fifth generation'
            ]
        },
        'Hardware': {
            'Controls all other parts of the computer': [
                'What is the Control Unit',
                'What is the ALU',
                'What is the Motherboard',
                'What is the RAM'
            ]
        }

    },
    'Five': {
        'Software': {
            'The language that computers read to carry out instructions': [
                'What is Binary',
                'What is Asssembly',
                'What is Object oriented',
                'What is Functional'
            ]
        },
        'Data': {
            'Changing a representation to use fewer bits to store information': [
                'What is compression',
                'What is compaction',
                'What is condensing',
                'What is constriction'
            ]
        },
        'Operating Systems': {
            'A user interface that uses icons and a mouse': [
                'What is a Graphical User Interface (GUI)',
                'What is a Command Line Interface (CLI)',
                'What is a menu driven interface (MDI)',
                'What is a natural language interface (NLI)'

            ]
        },
        'Computer History': {
            'The observation that the number of transistors on integrated circuits doubles approximately every two years': [
                'What is Moore\'s Law',
                'What is Turing\'s Law',
                'What is Murphy\'s Law',
                'What is Hopper\'s Law'
            ]
        },
        'Hardware': {
            'Circuits that carry data from one area to another': [
                'What is busses',
                'What is integrators',
                'What is orchestrators',
                'What is assimilators'
            ]
        }

    }
}

let gameList = {};
const numbers = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five']
const categories = ['Software', 'Data', 'Operating Systems', 'Computer History', 'Hardware'];

const startGame = () => {
    gameList = mainList;
    buildBoard(0);
}

const buildBoard = (roundNum) => {
    for(let i = 0; i <= 5; i++){
        if(i == 0){
            $('#container').append(buildTitleRow());
        }else{
            $('#container').append(buildRow(numbers[i], roundNum));
        }
    }
}

const buildTitleRow = () => {
    const $titleRow = $('<div>').addClass('row').attr('id', 'title');
    for(let i = 0; i < 5; i++){
        $titleRow.append(buildTitle(categories[i]));
    }
    return $titleRow;
}

const buildTitle = (category) => {
    const $title = $('<div>').addClass('title').attr('id', 'category').text(category);
    return $title;
}

const buildRow = (rowNum, roundNum) => {
    const newRow = $('<div>').addClass('row').attr('id', rowNum);
    console.log(rowNum);
    for(let i = 0; i < 5; i++){
        newRow.append(buildItem(categories[i], rowNum, roundNum));
    }
    return newRow;
}

const buildItem = (category, rowNum, roundNum) => {
    const newItem = $('<div>').addClass('question').attr('id', `${category}_${rowNum}`);
    let key = Object.keys(gameList[rowNum][category])[roundNum];

    newItem.text(key);
    console.log(gameList[rowNum][category])
    return newItem;
}

$(() => {
    startGame();
});