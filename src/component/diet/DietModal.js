import {Form, FormGroup, InputGroup, Input, Button
  , Modal, ModalHeader, ModalBody, ModalFooter, Table} from 'reactstrap';
import {createContext, useState, useContext, useEffect } from 'react';
import { DietSchedulerContext } from './DietScheduler';
import DietListModal from './DietListModal';
import { Search } from 'react-bootstrap-icons';
import './ModalCommon.css';
import axios from 'axios';
import { useSelector } from 'react-redux'; // redux state값을 읽어온다 토큰값과 userId값을 가져온다.

/**
 * 식단 리스트 출력, 수정, 삭제 Modal컴포넌트
 * @returns 
 */
export const DietModalContext = createContext();

export default function DietModal({dietValue}) {

  const context = useContext(DietSchedulerContext);

  /* 모달2 State변수 */
  const [modalShow2, setModalShow2] = useState(false);
  const [modalShowResearchParam, setModalShowResearchParam] = useState(false);

  /* 식단 리스트 배열 */
  const [dietListArray, setDietListArray] = useState([]);

  /* 검색창 검색어 State변수 */
  const [searchParam, setSearchParam] = useState('');

  /* 모달 2 파라미터 배열 변수(rno값) State변수 */
  const [selectRecipeData, setSelectRecipeData] = useState([]);
  const [mealDivStr, setMealDivStr] = useState('');
  const [disaabled, setDisabled] = useState(true);
  const [modalStyle, setModalStyle] = useState({ width: "700px", position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)" })

  /* 식단 목표 칼로리, 칼로리 총합 변수 선언 및 초기화*/
  const [targetKcal, setTargetKcal] = useState(0);
  const [totalKcal, setTotalKcal] = useState(0);
  const [achieve, setAchieve] = useState(false)

  /**
   * 페이지 초기 진입 init
   */
  useEffect(()=>{
    setMealDivStr(dietValue.mealDivStr)
    dietSearch(dietValue.mealDivStr);
  },[])

  /** 
   * 모달 제어 함수 
   */
  const modalToggle2 = () => {
    if(modalShow2==false){
      setModalStyle({...modalStyle, left: "35%"})
    }
    if(modalShow2==true) {
      setModalStyle({...modalStyle, left: "50%"})
    }
    setModalShow2(!modalShow2);
  }
  const modalStateValue = () => {
    setModalShowResearchParam(!modalShowResearchParam);
  }
  const userId = useSelector( (state) => {return state.UserId} );

  /**
   * 식단 검색 함수
   * @param {*} mealDivValue 
   */
  const dietSearch = (mealDivValue) => {
    let param = {}
    let url = "/dietSearch";
    switch (mealDivValue) {
      case '아침': 
      param = {params:{userId: userId, dietDate : dietValue.dietDate, mealDiv: '1'}};
      break;
      case '점심': 
      param = {params:{userId: userId, dietDate : dietValue.dietDate, mealDiv: '2'}};
      break;
      case '저녁': 
      param = {params:{userId: userId, dietDate : dietValue.dietDate, mealDiv: '3'}};
    }
    axios.get(url, param)
    .then((res)=>{
      setDietListArray(res.data.dietList)
      // targetKacl이 널 혹은 undefined일경우 0 그렇지않으면 타겟칼로리 반환
      setTargetKcal(
        res.data.achieve.targetKcal == undefined || res.data.achieve.targetKcal == null ? 0 : res.data.achieve.targetKcal
        )
        
      if(res.data.dietList.length > 0) {
        let kcalTotalSum = 0;
        for(let i=0; i<res.data.dietList.length; i++) {
          kcalTotalSum += res.data.dietList[i].recipe.kcal;
        }
        console.log(kcalTotalSum)
        setTotalKcal(kcalTotalSum)
        setAchieve(res.data.achieve.achieve)
      }else {
        setTotalKcal(0)
      }
      if(res.data.achieve.achieve == undefined || res.data.achieve.achieve == null) {
        setAchieve(false)
      }
      
    })
    .catch((res)=>{
    })
  }

  /**
   * 식단 리스트 랜더
   */
  let renderDietArr = [];
  const dietList = (dietListArray) =>{
    renderDietArr = []
    // if(dietListArray.length == 0) return;
    for(let i=0; i<dietListArray.length; i++) {

      renderDietArr.push(
        <tr key={dietListArray[i].dno} id={dietListArray[i].dno}>
          <td>
            <a style={{textDecoration: "none", color : "black"}} target='_blank'
             onClick={(e)=>{
              e.preventDefault();
              alert("새 탭으로 열립니다");
              //href={`http://localhost/reciperef/${dietListArray[i].recipe.rno}`} 
              window.open(`http://localhost/reciperef/${dietListArray[i].recipe.rno}`)
            }}>{dietListArray[i].recipe.title}</a>
          </td>
          <td>
            {dietListArray[i].recipe.kcal}Kcal
          </td>
          <td style={{textAlign:"right"}}>
            {/* <a href="http://localhost/dietmenu" className="hyphenIcon" style={{display: "show",textDecoration: "none", color : "black" }} onClick={delHypen}><img style={{width:"25px", float:"right"}}src={require("./delete_icon.png")}/></a>           */}
            <img onClick={delHypen} className="hyphenIcon" style={{cursor:"pointer", color : "black" , width:"25px", float:"right"}}src={require("./delete_icon.png")}/>
          </td>
        </tr>
      )
    }
    return renderDietArr;
  }

  /* 식단 목표 칼로리, 토탈 칼로리 */
  const dietKcal = (dietListArray) => {
    let achieve = '';
    let rendekcalArr = [];
    let kcalTotal = 0;
    let targetKcalVal = 0;
    // setTargetKcal(dietListArray[0].targetKcal)
    for(let i=0; i<dietListArray.length; i++) {
      kcalTotal += dietListArray[i].recipe.kcal;
      // setTargetKcal(dietListArray[0].targetKcal)
      /* 식단 리스트 0일경우 목표칼로리 입력창 활성화 */
      targetKcalVal = dietListArray[0].targetKcal;
      achieve = dietListArray[0].achieve;
    }
    // setTargetKcal(targetKcalVal)
    rendekcalArr.push(
      <tr key={0}>
        <td>
          <Input type="text" id="kcalInput" style={{width:"55px",height:"20px", display:"inline-block"}}
                 disabled={disaabled} onChange={(e)=>{
                  // targetKcal=e.target.value;
                  // setTargetKcal(e.target.value);
                  }}/>Kcal
        </td>
        <td>
          {kcalTotal}Kcal
        </td>
        <td>
          <span style={{display:"block"}}>
            <label htmlFor="TargetTf">달성</label>&nbsp;&nbsp;&nbsp;
            <input type="checkbox" name="TargetTf" id="TargetTf" disabled={disaabled}/>
          </span>
        </td>
    </tr>
    ) 
    return rendekcalArr;
  }

  /**
   * 식단구분 select 콤보 체인지 이벤트 콜백 함수
   */
  const selectChange = (e)=>{
    // e.preventDefault();
    setMealDivStr(e);
    dietSearch(e);
  } 
  
  /**
   * 검색창에 검색한 데이터 전역변수 초기화
  */
  const initSearchParam = (e) => {
    e.preventDefault();
    setSearchParam(e.target.value);
  }
  
  /**
   * 식단 삭제
   */
  const delHypen = (e) => {
    e.preventDefault();
    var that = e.target.parentNode.parentNode; // 이벤트가 발생한 태그의 조부모태그
    var key = that.id; // 이벤트가 발생한 태그의 조부모태그
    if(window.confirm("정말 삭제하시겠습니까?")) {
      axios.delete('/dietDelete', {data : {dNo : key} } )
      .then((response)=>{
        // var arrTr = renderDietArr.filter((item) => {
        //   return item.key != key; // 원본 배열과 일치하지 않는 데이터 배열로 반환
        // });
        // renderDietArr=arrTr; // let renderDietArr 배열에 삭제된 값으로 초기화(덮어씌움)
        // that.remove(); // 이벤트가 발생한 태그의 조부모 제거
        /* 삭제 후 재 조회 처리!! */
        dietSearch(mealDivStr); 
      })
      .catch((error)=>{
        return alert("삭제에 실패하였습니다.");
      })
      
    }
  }

   /**
   * 목표칼로리 저장
   * @param : 식단 날짜, 식단 구분
   */
  //  const submit = (mealDivStr) => {
  //   let param = {}
  //   switch (mealDivStr) {
  //     case '아침': 
  //     param = {dietDate : dietValue.dietDate, mealDiv: '1', targetKcal:targetKcal}; //사용자가 직접 체크
  //     break;
  //     case '점심': 
  //     param = {dietDate : dietValue.dietDate, mealDiv: '2', targetKcal:targetKcal}; //사용자가 직접 체크
  //     break;
  //     case '저녁': 
  //     param = {dietDate : dietValue.dietDate, mealDiv: '3', targetKcal:targetKcal}; //사용자가 직접 체크
  //   }
  //   if(window.confirm("입력하신 목표 칼로리를 저장 하시겠습니까?")) {
  //     axios.put('/targetKcalSave', param)
  //     .then((response)=>{
  //       dietSearch(mealDivStr); 
  //     })
  //     .catch((error)=>{
  //       alert("저장에 실패하였습니다.");
  //     })
      
  //   }
  // }
   const targetSave = (mealDivStr) => {
    let param = {}
    switch (mealDivStr) {
      case '아침': 
      param = {userId: userId, dietDate : dietValue.dietDate, mealDiv: '1', targetKcal:targetKcal}; //사용자가 직접 체크
      break;
      case '점심': 
      param = {userId: userId, dietDate : dietValue.dietDate, mealDiv: '2', targetKcal:targetKcal}; //사용자가 직접 체크
      break;
      case '저녁': 
      param = {userId: userId, dietDate : dietValue.dietDate, mealDiv: '3', targetKcal:targetKcal}; //사용자가 직접 체크
    }
    if(window.confirm("입력하신 목표 칼로리를 저장 하시겠습니까?")) {
      axios.put('/targetKcalSave', param)
      .then((response)=>{
        dietSearch(mealDivStr); 
      })
      .catch((error)=>{
        alert("저장에 실패하였습니다.");
      })
      
    }
  }

  /**
   * 달성여부 통신
   * @param {*} mealDivStr 
   * @param {*} checkValue 
   */
   const achieveSave = (mealDivStr, checkValue) => {
    let param = {}
    switch (mealDivStr) {
      case '아침': 
      param = {userId: userId, dietDate : dietValue.dietDate, mealDiv: '1', achieve:checkValue}; //사용자가 직접 체크
      break;
      case '점심': 
      param = {userId: userId, dietDate : dietValue.dietDate, mealDiv: '2', achieve:checkValue}; //사용자가 직접 체크
      break;
      case '저녁': 
      param = {userId: userId, dietDate : dietValue.dietDate, mealDiv: '3', achieve:checkValue}; //사용자가 직접 체크
    }
    axios.put('/achieveSave', param)
    .then((response)=>{})
    .catch((error)=>{
      alert("저장에 실패하였습니다.");
    })
  }

  /**
   * 수정 버튼 클릭 함수
   * @param {} e 
   */
  const modifyButtonClick = (e) => {
    e.preventDefault();
    setDisabled(!disaabled);

  }

  /**
   * 저장 버튼 클릭 함수
   * @param {} e 
   */
  const saveButtonClick = (e) => {
    e.preventDefault();
    // submit(mealDivStr);
    targetSave(mealDivStr);
    setDisabled(!disaabled);
  }

  /**
   * context로 이중모달에 넘길 객체 (속성,메소드)
   */
  const data = {
    mealDivStr : mealDivStr
    , dietDate : dietValue.dietDate
    , dietListArray : dietListArray
    , targetKcal : targetKcal
    , totalKcal : totalKcal
    , setDietListArray : setDietListArray.bind(this)
    , dietSearch : dietSearch.bind(this)

  }

  const modal2 = {
    modalShow2 : modalShow2
  , setModalShow2 : setModalShow2.bind(this)
  , modalToggle2: modalToggle2.bind(this)

  }
  return (
    <>
      <Modal isOpen={context.modalShow1} fade={true} toggle={context.modalToggle1} style={modalStyle}>
        <ModalHeader toggle={context.modalToggle1}>
            <InputGroup size="sm" style={{width:"100%"}}>
              <div style={{height:"30px", float:"left"}}>
                <span style={{width:"170px",display:"inline-block"}}>
                  {dietValue.fmtDateKr} 식단
                </span>
              </div>
              <div style={{width:"170px",display:"inline-block", height:"32px", paddingLeft: "0px"}}>
                <select name="" id="mealSelect" value={mealDivStr} onChange={(e)=>{selectChange(e.target.value)}}
                 style={{display:"inline", width:"85px", height:"30px", fontSize:"15px", padding:"4px 20px 0px 12px"}}>
                  <option value={"아침"} >아침</option>
                  <option value={"점심"} >점심</option>
                  <option value={"저녁"} >저녁</option>
                </select>
              </div>
              <div style={{height:"30px", float:"right"}}>
                <label htmlFor="TargetTf">달성</label>&nbsp;&nbsp;&nbsp;
                <input type="checkbox" name="TargetTf" id="TargetTf" checked={achieve} onChange={
                  (e)=>{
                    if(dietListArray.length==0){
                      alert("\n 식단이 등록되지 않았습니다. \n 식단을 먼저 등록해주세요.");
                      return false;
                    }
                    setAchieve(e.target.checked);
                    achieveSave(mealDivStr, e.target.checked);
                    }}
                />
              </div>
            </InputGroup>
        </ModalHeader>
        <ModalBody style={{ height: "400px" }}>
          <Form style={{overflow:"auto", height: "400px"}}>
            <FormGroup>
              <div style={{height:"38px"}}>
                <div id="inputGroup" style={{ margin: "0px", display:"show", float:"left"}}>
                  <InputGroup size="s">
                    <Input type="text" onKeyDown={(e)=>{
                      if(e.key == "Enter") {
                        e.preventDefault(); 
                          if(targetKcal == 0) {
                            alert("\n 목표 칼로리가 0입니다. \n 먼저 목표칼로리를 설정해주세요."); return;
                          }
                          if(targetKcal<totalKcal) {
                            alert("\n 목표 칼로리 수치를 초과하였습니다. \n 식단을 더이상 추가 할 수 없습니다."); return;
                          }
                        modalToggle2();
                    }
                  }
                }
                    onChange={initSearchParam} placeholder='레시피를 입력하세요' style={{width:"427px", display: "inline-block"}} />
                    <Button onClick={(e)=>{
                          e.preventDefault();
                          if(targetKcal == 0) {
                            alert("\n 목표 칼로리가 0입니다. \n 먼저 목표칼로리를 설정해주세요."); return;
                          }
                          if(targetKcal<totalKcal) {
                            alert("\n 목표 칼로리 수치를 초과하였습니다. \n 식단을 더이상 추가 할 수 없습니다."); return;
                          }
                          modalToggle2();
                        }
                      } color="secondary" style={{width:"40px"}}>
                      <Search style={{width:"20px", height:"20px",padding : "0 4 4 0"}}/>
                      </Button>
                  </InputGroup>
                </div>
              </div>
              <Table striped style={{width:"466px",tableLayout:"fixed", textAlign:"center"}}>
                <thead>
                  <tr>
                    <th>메뉴명</th>
                    <th>칼로리</th>
                    <th></th>
                  </tr>
                </thead>  
                <tbody id="listTbody">
                  {dietList(dietListArray)}
                  {/* {dietListArray.map((diet, i, dietListArray)=> {
                    return(
                      <tr key={diet.dno} id={diet.dno}>
                        <td>
                          <a style={{textDecoration: "none", color : "black"}} href="#" target='_blank' onClick={(e)=>{e.preventDefault();}}>{diet.recipe.title}</a>
                        </td>
                        <td>
                          {diet.recipe.kcal}Kcal
                        </td>
                        <td>
                          <a href="http://localhost/dietmenu" className="hyphenIcon" style={{ display: "show",textDecoration: "none", color : "black" }} onClick={delHypen}>(-)</a>
                        </td>
                      </tr>
                    )
                  })} */}
                </tbody>
              </Table>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Table striped style={{width:"466px",tableLayout:"fixed",textAlign:"center"}}>
                <thead>
                  <tr>
                    <th>목표 칼로리</th>
                    <th>칼로리 합계</th>
                    {/* <th>목표 달성 여부</th> */}
                  </tr>
                </thead>  
                <tbody>
                  {/* {dietKcal(dietListArray)} */}
                  <tr key={0}>
                    <td>
                      <Input type="text" id="kcalInput" style={{width:"70px",height:"20px", display:"inline-block"}}
                            value={targetKcal} disabled={disaabled} onChange={(e)=>{
                              // if(e.target.value == 0)
                              setTargetKcal(e.target.value);
                              }}/>Kcal
                    </td>
                    <td>
                      {totalKcal}Kcal
                    </td>
                    <td>
                      <span style={{display:"block"}}>
                        {/* <label htmlFor="TargetTf"></label>&nbsp;&nbsp;&nbsp; */}
                        {/* <input type="checkbox" name="TargetTf" id="TargetTf" disabled={disaabled} checked={achieve} onChange={(e)=>{setAchieve(e.target.checked)}}/> */}
                      </span>
                    </td>
                  </tr>
                              
                </tbody>
            </Table><br/><br/>
            <Button id="modifyButton" color="secondary" onClick={modifyButtonClick} disabled={!disaabled}>수정</Button>
            <Button id="saveButton" color="secondary" onClick={saveButtonClick} disabled={disaabled}>저장</Button>
        </ModalFooter>
      </Modal>
      { modalShow2 &&
          <DietModalContext.Provider value={modal2}>
            <DietListModal modalSearchProps={searchParam} data={data}/>
          </DietModalContext.Provider>
        }
    </>

  )
}