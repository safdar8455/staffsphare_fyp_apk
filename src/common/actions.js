import { Actions } from 'react-native-router-flux';

export const push = (destinationScene, props) => {

    if (Actions.currentScene === destinationScene) {
        return;
    }
    return Actions[destinationScene](props);
};