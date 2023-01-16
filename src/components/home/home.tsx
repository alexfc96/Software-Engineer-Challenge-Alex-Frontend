import React, {FC, useEffect, useState} from "react";

import AllVideos from "./allVideos/allVideos";
import "./home.css"
import NavbarLayout from "../navbarLayout/navbarLayout";
import { Video } from "../../types";
import axios from "axios";

const Home: FC = () => {
  const [videos, setVideos] = useState<Array<Video> | undefined>(undefined);
  const [page, setPage] = useState(1);

  const getVideos = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/api/videos/all?page=${page}`);
        setVideos(response.data)
    } catch (error) {
        console.error(error);
    }
  }

  useEffect(() => {
    getVideos()
  }, [page]);

  return (
    <div>
      <NavbarLayout />
      <div className="homeFlex">
        {videos && <AllVideos videos={videos} page={page} setPage={setPage} />}
        {!videos && <h2>No videos at this moment. Try again later.</h2>}
      </div>
    </div>
  );
};

export default Home;