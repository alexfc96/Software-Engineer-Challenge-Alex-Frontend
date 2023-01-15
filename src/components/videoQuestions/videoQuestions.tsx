import React, {FC} from "react";
import { useState, useEffect } from "react";
import axios from 'axios';
import YouTube, { YouTubePlayer } from "react-youtube";

import { useParams } from 'react-router-dom';
import { Video } from "../../types";
import { QuestionsComponent } from "./questionsComponent/questionsComponent";
import { ViewsComponent } from "./viewsComponent/viewsComponent";
import NavbarLayout from "../navbarLayout/navbarLayout";

interface YouTubeStateChangeEvent {
    data: number;
    target: YouTubePlayer;
}

const VideoQuestions: FC = () => {
    const { videoId } = useParams();

    const [video, setVideo] = useState<Video | undefined>(undefined);
    const [question, setQuestion ] = useState<string | undefined>(undefined)

    let videoElement: YouTubePlayer = null;
    let intervalId: NodeJS.Timeout;

    const handleAlertAccept = (videoElement: YouTubeStateChangeEvent) => {
        videoElement.target.playVideo();
    };

    const createAlert = (text: string, videoElement: YouTubeStateChangeEvent) => {
        setQuestion(undefined);
        alert("Question: " + text);
        handleAlertAccept(videoElement);
    };

    const handleOnStateChange = (event: YouTubeStateChangeEvent) => {
        if (event.data === YouTube.PlayerState.PLAYING) {
          videoElement = event;
          intervalId = setInterval(() => {
            if (event.target) {
              if(video) {
                video.questions.forEach((question) => {
                    if(!question.shown){
                        if(question.time === 0) question.time = 1;
                        if (event.target.getCurrentTime() >= question.time && event.target.getCurrentTime() <= question.time + 1) {
                            if (videoElement.target.playerInfo.playerState === 1) {
                                videoElement.target.pauseVideo();
                                question.shown = true;
                                setQuestion(question.text)
                            }
                        }
                    }
                })
              }
            }
          }, 1000);
        }
        if (event.data === YouTube.PlayerState.PAUSED) {
            if(question) createAlert(question, event);
        }

      }

    const getVideo = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/videos/${videoId}`);
            setVideo(response.data)
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
      getVideo();
      return () => clearInterval(intervalId);
    }, []);

    return (
        <div>
            <NavbarLayout />
            {video &&
                <div className="divideBlocks">
                    <div>
                        <h2 style={{marginRight: "0 3%"}}>{video?.title}</h2>
                        {video && <YouTube
                            videoId={video.videoId}
                            onStateChange={handleOnStateChange}
                        />
                        }
                    </div>
                    <div className="questionsBlock">
                        {video.questions &&
                            <QuestionsComponent questions={video.questions} />
                        }
                        <ViewsComponent views={video.views} />
                    </div>
                </div>
            }
        </div>
    )
}

export default VideoQuestions;