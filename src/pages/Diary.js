import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DiaryStateContext } from "../App";

import { getStringDate } from "../util/date";
import { emotionList } from "../util/emotion";

import MyHeader from "./../components/MyHeader";
import MyButton from "./../components/MyButton";

const Diary = () => {
  const { id } = useParams(); // pathVariable = id
  const diaryList = useContext(DiaryStateContext); // diaryList 가져오기
  const navigate = useNavigate(); // 이동
  const [data, setData] = useState();

  // title 가져온 후 상세페이지의 id 표시 (id번 일기)
  useEffect(()=>{
    const titleElement = document.getElementsByTagName("title")[0];
    titleElement.innerHTML = `감정 일기장 - ${id}번 일기`;
  },[id]);

  // 데이터는 컴포넌트가 mount된 시점에서 가져온다
  // 조건 : 일기데이터가 1개라도 있을 때만 가져온다 (id 오류 방지 형변환)
  // deps : id나 diaryList가 변할 때만 가져온다
  useEffect(()=>{
    if(diaryList.length >= 1) {
      const targetDiary = diaryList.find((it)=>parseInt(it.id) === parseInt(id));
      console.log(targetDiary); // 가져온 id의 일기데이터 출력

      // 현재 상세페이지에서 보여줘야 하는 데이터를 id를 기준으로 찾아온다면 
      if(targetDiary) { // 일기가 존재할 때
        setData(targetDiary);
      }
      else { // 일기가 없을 때 홈으로 이동
        alert("없는 일기 입니다.");
        navigate('/', {replace:true});
      }
    }
  },[id, diaryList, navigate]);

  // 데이터가 없으면
  if(!data) {
    return <div className="DiaryPage">로딩중입니다...</div>;
  }
  // 데이터가 존재하면
  else {
    // 오늘의 감정 불러오기
    const curEmotionData = emotionList.find((it)=>parseInt(it.emotion_id) === parseInt(data.emotion));
    console.log(curEmotionData);

    return (
      <div className="DiaryPage">
        {/* header의 조회한 일기 데이터의 날짜를 가져오기 (getStringDate를 받아서 시간객체로) */}
        <MyHeader
          headText={`${getStringDate(new Date(data.date))} 기록`}
          leftChild={<MyButton text={"< 뒤로가기"} onClick={()=>navigate(-1)} />}
          rightChild={<MyButton text={"수정하기"} onClick={()=>navigate(`/edit/${data.id}`)} />}
        />
        <article>
          <section>
            <h4>오늘의 감정</h4>
            {/* 원본 데이터의 감정 가져오기 */}
            <div className="diary_img_wrapper">
              <img src={curEmotionData.emotion_img} alt={`${curEmotionData.emotion_descript}`} />
              <span className="emotionDesc">{curEmotionData.emotion_descript}</span>
            </div>
          </section>
          <section>
            <h4>오늘의 일기</h4>
            {/* 원본 데이터의 일기 내용 가져오기 */}
            <div className="diary_content_wrapper">
              <p>{data.content}</p>
            </div>
          </section>
        </article>
      </div>
    );
  }
}

export default Diary;