import React, {useEffect, useState} from 'react';
import {FlatList, Pressable, TouchableOpacity} from 'react-native';
import {ImageType} from '../../apis/post/types';
import {WINDOW_WIDTH} from '../../constants/dimension';
import FastImage from 'react-native-fast-image';
import PostVideo from 'components/common/PostVideo';
import CloseSvg from 'assets/images/x_white.svg';
import Viewer from './Viewer';

interface PostImageProps {
  images: ImageType[];
  type: 'WRITE' | 'POST';
  handleDeleteImage?: (path: string) => void;
}

const PostImage = (props: PostImageProps) => {
  const {images, type, handleDeleteImage} = props;

  const offset = type === 'POST' ? 1 : 2;

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewIndex, setViewIndex] = useState(0);

  useEffect(() => {
    if (images.length) {
      if (images[0].width / images[0].height >= 0.75) {
        setWidth(WINDOW_WIDTH / offset - 30);
        setHeight(
          images[0].height * ((WINDOW_WIDTH / offset - 30) / images[0].width),
        );
      } else {
        const IMAGE_HEIGHT = (WINDOW_WIDTH / offset - 30) / 0.75;
        setHeight(IMAGE_HEIGHT);
        setWidth(
          Math.max(
            images[0].width * (IMAGE_HEIGHT / images[0].height),
            105 / offset,
          ),
        );
      }
    }
  }, [images, offset]);

  return (
    <>
      <FlatList
        data={images}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        renderItem={({item, index}) => (
          <Pressable
            onPress={() => {
              setIsViewerOpen(true);
              setViewIndex(index);
            }}>
            {item.path.endsWith('MOV') ||
            item.path.endsWith('MP4') ||
            item.path.endsWith('mov') ||
            item.path.endsWith('mp4') ? (
              <PostVideo
                video={item}
                index={index}
                imagesLength={images.length}
                width={width}
                height={height}
                type={type}
                handleDeleteImage={handleDeleteImage}
              />
            ) : (
              <FastImage
                source={{uri: item.path}}
                resizeMode="cover"
                style={[
                  {
                    width:
                      images.length === 1
                        ? width
                        : Math.max(
                            Math.min(
                              item.width * (250 / offset / item.height),
                              WINDOW_WIDTH / offset - 60,
                            ),
                            150 / offset,
                          ),
                    height: images.length === 1 ? height : 250 / offset,
                    borderRadius: 5,
                    marginLeft: 10,
                    borderWidth: 0.5,
                    borderColor: '#d1d1d1',
                  },
                ]}
              />
            )}
            {type === 'WRITE' && (
              <TouchableOpacity
                onPress={() => handleDeleteImage?.(item.path)}
                activeOpacity={0.5}
                className="bg-black/70 absolute right-[6] top-[6] p-[6] rounded-full">
                <CloseSvg width={10} height={10} />
              </TouchableOpacity>
            )}
          </Pressable>
        )}
      />
      <Viewer
        images={images}
        isViewerOpen={isViewerOpen}
        setIsViewerOpen={setIsViewerOpen}
        viewIndex={viewIndex}
      />
    </>
  );
};

export default PostImage;
