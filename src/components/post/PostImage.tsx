import React, {useEffect, useState} from 'react';
import {FlatList, Image, Pressable} from 'react-native';
import {ImageSizeType} from '../../apis/post/types';
import {WINDOW_WIDTH} from '../../constants/dimension';
import ImageView from 'react-native-image-viewing';
import FastImage from 'react-native-fast-image';
import PostVideo from 'components/common/PostVideo';

interface PostImageProps {
  images: ImageSizeType[];
}

const PostImage = (props: PostImageProps) => {
  const {images} = props;

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  const [isViewer, setIsViewer] = useState(false);
  const [curImage, setCurImage] = useState(0);

  useEffect(() => {
    if (images.length) {
      if (images[0].width / images[0].height >= 0.75) {
        setWidth(WINDOW_WIDTH - 30);
        setHeight(images[0].height * ((WINDOW_WIDTH - 30) / images[0].width));
      } else {
        const IMAGE_HEIGHT = (WINDOW_WIDTH - 30) / 0.75;
        setHeight(IMAGE_HEIGHT);
        setWidth(
          Math.max(images[0].width * (IMAGE_HEIGHT / images[0].height), 105),
        );
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
            {item.url.endsWith('MOV') || item.url.endsWith('MP4') ? (
              <PostVideo
                video={item}
                index={index}
                imagesLength={images.length}
                width={width}
                height={height}
                type="POST"
              />
            ) : (
              <FastImage
                source={{uri: item.url}}
                resizeMode="cover"
                style={[
                  {
                    width:
                      images.length === 1
                        ? width
                        : Math.max(
                            Math.min(
                              item.width * (250 / item.height),
                              WINDOW_WIDTH - 60,
                            ),
                            150,
                          ),
                    height: images.length === 1 ? height : 250,
                    borderRadius: 5,
                    marginLeft: 10,
                    borderWidth: 0.5,
                    borderColor: '#d1d1d1',
                  },
                ]}
              />
            )}
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
