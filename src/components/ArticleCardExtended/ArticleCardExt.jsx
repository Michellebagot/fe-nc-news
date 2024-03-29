import { useEffect, useState } from "react";
import {
  getArticleById,
  getCommentsByArticleId,
  voteOnArticle,
} from "../../utils/app";
import CommentCard from "../CommentCard/CommentCard";
import Loading from "../Loading/Loading";
import "./ArticleCardExt.css";
import moment from "moment";
import MakeComment from "../MakeComment/MakeComment";
import { useParams } from "react-router-dom";
import NotFound from "../NotFound/NotFound";

const ArticleCardExt = ({ article_id }) => {
  const [currentArticle, setCurrentArticle] = useState({ article_id });
  const [articleComments, setArticleComments] = useState([]);
  const [loadingState, setLoadingState] = useState(false);
  const [currentUser, setCurrentUser] = useState("jessjelly");
  const [errorState, setErrorState] = useState(false);
  const params = useParams();

  useEffect(() => {
    setLoadingState(false);
    getArticleById(params.article_id)
      .then((response) => {
        if (response === 404) {
          setErrorState(true);
        }
        setCurrentArticle(response[0]);
        setLoadingState(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setLoadingState(false);
    getCommentsByArticleId(params.article_id)
      .then((response) => {
        if (response === 404) {
          setErrorState(true);
        }
        setArticleComments(response);
        setLoadingState(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const voteUp = () => {
    setCurrentArticle((currArticle) => ({
      ...currArticle,
      votes: currArticle.votes + 1,
    }));

    voteOnArticle(params.article_id, { inc_votes: 1 }).catch((error) => {
      setCurrentArticle((currArticle) => ({
        ...currArticle,
        votes: currArticle.votes - 1,
      }));
    });
  };

  const voteDown = () => {
    setCurrentArticle((currArticle) => ({
      ...currArticle,
      votes: currArticle.votes - 1,
    }));

    voteOnArticle(params.article_id, { inc_votes: -1 }).catch((error) => {
      setCurrentArticle((currArticle) => ({
        ...currArticle,
        votes: currArticle.votes + 1,
      }));
    });
  };

  if (loadingState === false) {
    return <Loading />;
  } else if (errorState) {
    return <NotFound />;
  } else {
    return (
      <div className="extArt">
        <section className="extArticleContainer">
          <h3>{currentArticle.title}</h3>
          <h4>{currentArticle.topic}</h4>
          <img src={currentArticle.article_img_url} alt={`image for ${currentArticle.title}`} />
          <p>{currentArticle.body}</p>
          <p>{currentArticle.author}</p>
          <p>Votes: {currentArticle.votes}</p>
          <button
            className="votingButton"
            onClick={() => {
              voteDown();
            }}
          >
            👎
          </button>
          <button
            className="votingButton"
            onClick={() => {
              voteUp();
            }}
          >
            👍
          </button>{" "}
          <p>
            {moment(currentArticle.created_at).format(
              "MMMM Do YYYY, h:mm:ss a"
            )}
          </p>
        </section>
        <section>
          <MakeComment currentUser={currentUser} />
        </section>
        <section>
          <ul>
            {articleComments.map((comment) => {
              return (
                <CommentCard
                  key={comment.comment_id}
                  comment={comment}
                  currentUser={currentUser}
                />
              );
            })}
          </ul>
        </section>
      </div>
    );
  }
};

export default ArticleCardExt;
