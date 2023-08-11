import * as readline from 'readline';
import { executeWithDelay } from "./utils";
import { PnLCache } from './PnLCache';
import { InputSteps } from './types';


let cache: PnLCache;
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


function executeListOfCommands(
  commands: string[],
  args: any[],
  delays: number[]
) {
  commands.forEach((command, index) => {
    // Initialize cache
    if (!cache) {
      if (command === 'PnLCache') {
        cache = new PnLCache();
        console.log(null)
      } else {
        console.log('Cache not initialized');
      }
      return;
    }

    // Execute commands
    if (typeof (cache as any)[command] === 'function') {
      executeWithDelay(
        () => (cache as any)[command](...args[index]),
        delays[index]
      );
    } else {
      console.log(`Function ${command} not found`);
    }
  });
}


const scenarioData = {
  [InputSteps.COMMANDS]: [],
  [InputSteps.ARGS]: [],
  [InputSteps.DELAYS]: []
}

function askForInput(step: InputSteps) {
  let question = 'Please enter commands array: '
  if (step === InputSteps.ARGS) question = 'Please enter arguments: '
  if (step === InputSteps.DELAYS) question = 'Please enter delays: '

  rl.question(question, (input) => {
    scenarioData[step] = JSON.parse(input);

    if (step !== InputSteps.DELAYS) {
      const nextStep = step + 1;
      askForInput(nextStep);
    } else {
      // If this is the last step, execute commands
      console.log('Output:')
      executeListOfCommands(
        scenarioData[InputSteps.COMMANDS],
        scenarioData[InputSteps.ARGS],
        scenarioData[InputSteps.DELAYS]
      );

      // Restart scenario
      const delaysData = scenarioData[InputSteps.DELAYS];
      executeWithDelay(
        () => {
          console.log('--- New scenario: ---');
          askForInput(InputSteps.COMMANDS);
        },
        delaysData[delaysData.length - 1] + 1000
      );
    }
  });
}

console.log('--- New scenario: ---')
askForInput(InputSteps.COMMANDS)