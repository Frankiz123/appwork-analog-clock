import { Image, useWindowDimensions } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { styles } from './styles';

const headerImg = require('../../assets/images/appwork.png');

const HeaderImage = () => {
  const { width } = useWindowDimensions();

  return (
    <SafeAreaView>
      <Image
        source={headerImg}
        style={[styles.headerImage, { width }]}
        resizeMode="contain"
      />
    </SafeAreaView>
  );
};

export default HeaderImage;
