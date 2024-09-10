import React, {useEffect, useState} from 'react';
import {FlatList, Image, Pressable} from 'react-native';
import {ImageSizeType} from '../../apis/post/types';
import {WINDOW_WIDTH} from '../../constants/dimension';
import ImageView from 'react-native-image-viewing';

interface PostImageProps {
  images: ImageSizeType[];
}

const PostImage = (props: PostImageProps) => {
  const {images} = props;

  const [imageHeight, setImageHeight] = useState(0);
  const [isViewer, setIsViewer] = useState(false);
  const [curImage, setCurImage] = useState(0);

  useEffect(() => {
    if (images.length) {
      if (WINDOW_WIDTH - 90 < images[0].width) {
        setImageHeight(
          images[0].height * ((WINDOW_WIDTH - 90) / images[0].width),
        );
      } else {
        if (images[0].height > 350) {
          setImageHeight(350);
        } else {
          setImageHeight(images[0].height);
        }
      }
    }
  }, [images]);

  return (
    <>
      <FlatList
        data={images}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => {
              setCurImage(index);
              setIsViewer(true);
            }}>
            <Image
              source={{uri: item.url}}
              resizeMode="cover"
              style={[
                {
                  width: item.width * (imageHeight / item.height),
                  height: imageHeight,
                  borderRadius: 5,
                  marginLeft: 15,
                  borderWidth: 0.5,
                  borderColor: '#d1d1d1',
                },
              ]}
            />
          </Pressable>
        )}
      />
      <ImageView
        images={images.map(item => ({uri: item.url}))}
        imageIndex={curImage}
        visible={isViewer}
        onRequestClose={() => setIsViewer(false)}
        presentationStyle="overFullScreen"
        backgroundColor="rgba(0,0,0,0.9)"
      />
    </>
  );
};

export default PostImage;
