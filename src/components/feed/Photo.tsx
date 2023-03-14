import { gql, useMutation } from "@apollo/client";
import {
  faBookmark,
  faComment,
  faPaperPlane,
  faHeart,
} from "@fortawesome/free-regular-svg-icons";
import { faHeart as SolidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";
import { FEED_QUERY } from "screens/Home";
import styled from "styled-components";
import { seeFeed_seeFeed } from "__generated__/seeFeed";
import Avatar from "../Avatar";
import { FatText } from "../shared";

const TOGGLE_LIKE_MUTATION = gql`
  mutation toggleLike($id: Int!) {
    toggleLike(id: $id) {
      ok
      error
    }
  }
`;

const PhotoContainer = styled.div`
  background-color: white;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.borderColor};
  margin-bottom: 60px;
  max-width: 615px;
`;
const PhotoHeader = styled.div`
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(239, 239, 239);
`;

const Username = styled(FatText)`
  margin-left: 15px;
`;

const PhotoFile = styled.img`
  min-width: 100%;
  max-width: 100%;
`;

const PhotoData = styled.div`
  padding: 12px 15px;
`;

const PhotoActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  div {
    display: flex;
    align-items: center;
  }
  svg {
    font-size: 20px;
  }
`;

const PhotoAction = styled.div`
  margin-right: 10px;
  cursor: pointer;
`;

const Likes = styled(FatText)`
  margin-top: 15px;
  display: block;
`;

interface IProps {
  id: number;
  user: {
    avatar?: string;
    username: string;
  };
  file: string;
  isLiked: boolean;
  likes: number;
}

function Photo({ id, user, file, isLiked, likes }: IProps) {
  const [toggleLikeMutation, { loading }] = useMutation(TOGGLE_LIKE_MUTATION, {
    variables: {
      id,
    },
    // 쿼리가 끝난후 실행되는 콜백
    update: (cache, result) => {
      const {
        data: {
          toggleLike: { ok },
        },
      } = result;

      // 쿼리가 잘 전동되었는지 확인
      if (ok) {
        const fragmentId = `Photo:${id}`;
        const fragment = gql`
          fragment BSName on Photo {
            isLiked
            likes
          }
        `;
        // 캐시에서 데이터 가져오기
        const cacheData: Partial<seeFeed_seeFeed> | null = cache.readFragment({
          id: fragmentId,
          fragment,
        });

        if (cacheData && "isLiked" in cacheData && "likes" in cacheData) {
          const { isLiked: cacheIsLiked, likes: cacheLikes } = cacheData;
          // 캐시를 업데이트
          cache.writeFragment({
            // 캐시 아이디
            id: fragmentId,
            // fragment 아무이름 on 타입
            fragment,
            data: {
              isLiked: !cacheIsLiked,
              likes: cacheIsLiked ? cacheLikes! - 1 : cacheLikes! + 1,
            },
          });
        }
      }
    },
  });
  return (
    <PhotoContainer key={id}>
      <PhotoHeader>
        <Avatar lg url={user.avatar} />
        <Username>{user.username}</Username>
      </PhotoHeader>
      <PhotoFile src={file} />
      <PhotoData>
        <PhotoActions>
          <div>
            <PhotoAction onClick={() => toggleLikeMutation()}>
              <FontAwesomeIcon
                style={{ color: isLiked ? "tomato" : "inherit" }}
                icon={isLiked ? SolidHeart : faHeart}
              />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faComment} />
            </PhotoAction>
            <PhotoAction>
              <FontAwesomeIcon icon={faPaperPlane} />
            </PhotoAction>
          </div>
          <div>
            <FontAwesomeIcon icon={faBookmark} />
          </div>
        </PhotoActions>
        <Likes>{likes === 1 ? "1 like" : `${likes} likes`}</Likes>
      </PhotoData>
    </PhotoContainer>
  );
}

export default Photo;
