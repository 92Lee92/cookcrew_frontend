import { useState, useEffect, Fragment } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { BsFillStarFill } from 'react-icons/bs'
import { BsHeartFill } from 'react-icons/bs';
import { BsFillEyeFill } from 'react-icons/bs';
import { fontSize } from '@mui/system';
import axios from 'axios';
import RecipeCreate from './RecipeCreate';
import { useParams } from 'react-router-dom';



export default function Tumbnail() {

    const [regId, setRegId] = useState([]);
    const [title, setTitle] = useState('');
    const [stitle, setStitle] = useState('');
    const [content, setContent] = useState([]);
    const [mat, setMat] = useState([]);
    const [source, setSource] = useState([]);
    const [imageUrl, setImageUrl] = useState('');
    const [cnt, setCnt] = useState('0');
    const [enabled, setEnabled] = useState('');
    const [regDate,setRegDate] = useState('');
    const [modDate,setModDate] = useState('');
    const [kcal,setKcal] = useState(0);

    const [ratingValue, setRatingValue] = useState(0);

    const { rNo } = useParams();


    useEffect(() => {
        axios.get(`/rcpref/${rNo}`)
            .then((response) => {
                const rcp = response.data;
                // console.log(response.data);
                // console.log(rcp.sTitle)
                setRegId(rcp.regId)
                setTitle(rcp.title)
                setStitle(rcp.stitle)
                setContent(rcp.content)
                setMat(rcp.mat)
                setSource(rcp.source)
                setImageUrl(rcp.thumbPath);
                setEnabled(rcp.enabled)
                setRegDate(rcp.regDate)
                setModDate(rcp.modDate)
                setKcal(rcp.kcal)
                // console.log(title);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    useEffect(() => {
        axios.get(`/ratingvalue/${rNo}`)
            .then((response) => {
                const view = response.data;
                console.log(response.data);

                /* const sumRate = view.reduce(function add(sum, currValue) {
                    return sum + currValue;
                }, 0);
                // console.log(sumRate);
                const avgRate = sumRate / view.length;
                // console.log(avgRate);
                setRatingValue(avgRate); */
                console.log(response.data);
                setRatingValue(view);

            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    useEffect(() => {
        axios.get(`/cnt/${rNo}`)
            .then((response) => {
                const incrementCnt = response.data;
                setCnt(incrementCnt);
            })
            .catch((error) => {
                console.log(error);
            })
    }, [])

    if (enabled == true) {
        return (
            <div style={{ width: '1080px', height: '700px' }}>
                <div style={{ float: 'left', width: '540px' }}>
                    <Fragment>
                        <Container fixed id='thumb_container'>
                            {/* ????????? ?????????????????? ???*/}
                            <img
                                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                src={imageUrl} alt='?????? ????????? ????????????' />
                        </Container>
                    </Fragment>
                </div>
                <div style={{ float: 'right', width: '540px' }}>
                    <Fragment>
                        <Container fixed id='detail_container'>
                            <div id='icons_group'>
                                {/* ?????????, ??????, ????????? ???????????? ??? */}
                                <span><BsFillEyeFill className='inline' />&nbsp;{cnt}</span>&nbsp;&nbsp;
                                <span><BsFillStarFill className='inline' />&nbsp;{ratingValue}</span>&nbsp;&nbsp;
                                <span><BsHeartFill className='inline' />&nbsp;17</span>&nbsp;&nbsp;
                                <div style={{float:'right'}}>
                                    {regDate === modDate ?
                                        <span style={{fontSize:'16px'}}>????????????&nbsp;{regDate}</span>
                                        : <span style={{fontSize:'16px'}}>????????????&nbsp;{modDate}</span>                            
                                    }
                                </div>
                            </div><hr />
                            <div id='explain_recipe'>
                                <div id='exp_title'>
                                    <h2 style={{ fontSize: '30px' }}>
                                        {/* ????????? ????????? ???????????? ??? */}

                                        <span style={{ color: 'blue' }}>
                                            '{regId}'
                                        </span> ??????
                                    </h2>
                                    <h2 style={{ fontSize: '30px' }}>
                                        {title}
                                        {/* ?????? ????????? ?????? */}
                                    </h2>
                                </div>
                                <div id='exp_text'>
                                    <p style={{ fontSize: '16px' }}>
                                        {/* ?????? ?????? ?????? ?????? ??? ?????? */}
                                        {stitle}
                                        {/* ????????? ????????? ??? ??? ???????????? ???????????? ?????????! <br />
                                    ????????? ?????? ????????? ?????? ??????<br />
                                    ???????????? ????????? ????????? ????????? ?????????<br />
                                    ?????? ????????? ????????? ?????????????! */}
                                    </p>
                                </div><hr />
                            </div>
                            <div id='explain_mat'>
                                <p style={{ fontSize: '28px' }}>

                                    <strong>??????</strong>
                                </p>
                                <div id='exp_mat'>
                                    <h3 style={{ fontSize: '20px' }}><strong>????????????</strong></h3>
                                    <p style={{ fontSize: '16px' }}>
                                        {/* ???????????? */}
                                        {mat}
                                    </p>
                                </div>
                                <div id='exp_source'>
                                    <h3 style={{ fontSize: '20px' }}><strong>??????</strong></h3>
                                    <p style={{ fontSize: '16px' }}>
                                        {source}
                                    </p>
                                </div>
                                <div id='exp_source'>
                                <p style={{ fontSize: '20px' }}>
                                        <strong>??????:</strong>&nbsp;{kcal}&nbsp;kcal
                                    </p>
                                </div>

                            </div>

                        </Container>
                    </Fragment>
                </div><hr />
            </div>
        )
    }
    else {
        return null;
    }
} 