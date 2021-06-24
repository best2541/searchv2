/*!

=========================================================
* Paper Dashboard React - v1.3.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/main/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useState } from "react";
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios'

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  FormGroup,
  Form,
  Input,
  Row,
  Col,
  Label
} from "reactstrap";
import { useParams } from "react-router";
// import { data } from "jquery";

function ItemDetail() {
  const { id } = useParams()
  const [movie, setMovie] = useState({})
  const userAccessToken = window.localStorage.getItem('userAccessToken')
  const [movieCategories, setMovieCategories] = useState([])
  const [selectedMovieCategories, setSelectedMoiveCategories] = useState([])
  const [loading, setLoading] = useState(<CircularProgress />)
  const [input, setInput] = useState({
    id: '', img: '', imgFile: null, engName: '', thName: '', etcName: '', movieYear: 0, ep: '', disc: 0, category: [], serie: '', mainCharater: '', company: '', length: 0,
    pokerCompany: '', pokerName: '', pokerTell: 0, pokerEmail: '', copyrightStart: '', copyrightEnd: '', dubstatus: '', dubteam: '', dubname: '',
    dubfinish: '', story: '', recorder: '', recordStatus: ''
  })
  let dubDate = new Date(movie.dubfinish).toLocaleDateString()
  let copyStart = new Date(movie.copyrightStart).toLocaleDateString()
  let copyEnd = new Date(movie.copyrightEnd).toLocaleDateString()

  function categoryChange(event) {
    const { id, checked } = event.target
    const numberId = Number(id)
    const updatedArray = new Set([...selectedMovieCategories])
    if (checked === true) {
      updatedArray.add(numberId)
    } else {
      updatedArray.delete(numberId)
    }
    setSelectedMoiveCategories([...updatedArray])
  }

  const [Checkbox, setCheckbox] = useState({
    thCheck: false, laosCheck: false, myanmarCheck: false, cambodiaCheck: false, vietnamCheck: false
  })

  function inputChange(event) {
    const { name, value } = event.target;
    setInput((prevInput) => {
      return {
        ...prevInput,
        [name]: value
      };
    });
  }

  const CheckboxChange = (event) => {
    const { name } = event.target;
    setCheckbox({
      ...Checkbox,
      [name]: event.target.checked
    })
  }

  const getContentDetailById = async (id) => {
    const { data } = await axios.get(`https://movie-search-backend.herokuapp.com/content/detail/${id}`)
    return data
  }

  const getCategories = async () => {
    const { data } = await axios.get(`https://movie-search-backend.herokuapp.com/content/categories`)
    return data
  }

  const getData = async () => {
    const [contentDetail, categories] = await Promise.all([
      getContentDetailById(id),
      getCategories()
    ])
    setMovie(contentDetail[0])
    setMovieCategories(categories)
    setSelectedMoiveCategories(contentDetail[0].categories.map(category => category.id))
    setCheckbox({
      ...Checkbox,
      thCheck: contentDetail[0].thCheck,
      laosCheck: contentDetail[0].laosCheck,
      myanmarCheck: contentDetail[0].myanmarCheck,
      cambodiaCheck: contentDetail[0].cambodiaCheck,
      vietnamCheck: contentDetail[0].vietnamCheck,
    })
    setMovie(contentDetail[0])
    console.log('movie:', movie)

  }
  useEffect(() => {
    getData()
  }, [])
  async function getBase64(file) {
    return new Promise(resolve => {
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  }

  function imgChange(event) {
    const file = event.target.files[0];
    getBase64(file)
      .then(result => {
        setInput({
          ...input,
          imgFile: result,
          img: file.name
        })
      })
      .catch(err => {
        console.log(err);
      });
  }

  const a = setTimeout(() => {
    setLoading(<h3>Not Found</h3>)
  }, [5000])

  //dropdown
  let thisYear = (new Date()).getFullYear();
  let allYears = [];
  for (let x = 1900; x <= thisYear; x++) {
    allYears.push(x)
  }

  const yearList = allYears.map((x) => { return (<option key={x}>{x}</option>) });


  async function clickSubmit(event) {
    event.preventDefault()
    await axios.put(`https://movie-search-backend.herokuapp.com/content/edit/${id}`, {
      id: input.id, img: input.img, imgFile: input.imgFile, engName: input.engName,
      thName: input.thName, etcName: input.etcName, movieYear: input.movieYear, ep: input.ep,
      disc: input.disc, category: selectedMovieCategories, serie: input.serie, mainCharater: input.mainCharater,
      company: input.company, pokerCompany: input.pokerCompany, pokerName: input.pokerName, pokerTell: input.pokerTell,
      pokerEmail: input.pokerEmail, copyrightStart: input.copyrightStart, copyrightEnd: input.copyrightEnd, dubstatus: input.dubstatus,
      dubteam: input.dubteam, dubname: input.dubname, dubfinish: input.dubfinish, recorder: input.recorder, recordStatus: input.recordStatus,
      story: input.story, length: input.length, thCheck: Checkbox.thCheck, laosCheck: Checkbox.laosCheck, myanmarCheck: Checkbox.myanmarCheck,
      cambodiaCheck: Checkbox.cambodiaCheck, vietnamCheck: Checkbox.vietnamCheck
    }, {
      timeout: 9000
    })
    return window.location.href = `/admin/category/item/${id}`
  }

  if (Object.keys(movie).length > 0) {
    const renderCategory = movie.categories.map(category => {
      return category.name
    })
    const renderMovieCategories = movieCategories.map(category => {
      const isActive = movie.categories.find(element => element.id === category.id)
      return (
        <>
          <input type="checkbox" id={category.id} name="category" value={category.id} key={category.id} defaultChecked={isActive} onChange={categoryChange} />
          <label className='px-1' for={category.name}>{category.name}</label>
        </>
      )
    })

    const clickDelete = async () => {
      const sure = window.confirm('ต้องการลบ ?')
      if (sure === true) {
        await axios.delete(`https://movie-search-backend.herokuapp.com/content/delete/${id}`
          , {
            timeout: 9000
          })
        alert('ลบเรียบร้อย!!')
        return window.location.href = `/admin/category`
      }
    }

    function renderButton() {
      if (userAccessToken) {
        return (
          <>
            <Button
              className="btn-round"
              color="primary"
              type="submit"
            >
              Update Profile
            </Button>
            <Button className="btn-round" color="danger" onClick={clickDelete}>Delete</Button>
          </>
        )
      }
    }

    //serie
    function isSerieIsSerie() {
      if (movie.serie == 'ซีรี่ย์')
        return true
    }
    function isSerieIsMovie() {
      if (movie.serie == 'ม้วนเดียว') {
        return true
      }
    }
    return (
      <>
        <div className="content">
          <Form onSubmit={clickSubmit}>
            <Row>
              <Col md="4">
                <Card className="">
                  <div className="image">
                    <img
                      alt="..."
                      src={movie.imgUrl || require("assets/img/damir-bosnjak.jpg").default}
                    />
                  </div>
                  <CardBody>
                    <Input type="file" name="file" id="exampleFile" onChange={imgChange} />
                  </CardBody>
                  <CardFooter>
                    <div className="button-container">
                      <Row>
                        <Col className="md-2">
                          <label>ผู้บันทึก</label>
                          <Input type='text' name='recorder' defaultValue={movie.recorder} onChange={inputChange} />
                        </Col>
                        <Col className='md-2'>
                          <label>สถานะ</label>
                          <Input type='text' name='recordStatus' defaultValue={movie.recordStatus} onChange={inputChange} />
                        </Col>
                      </Row>
                    </div>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Broker</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col>
                        <label>
                          บริษัทผู้ขาย
                        </label>
                        <Input type='text' name='pokerCompany' defaultValue={movie.pokerCompany} onChange={inputChange} />
                      </Col>
                      <Col>
                        <label>
                          ชื่อผู้ติดต่อ
                        </label>
                        <Input type='text' name='pokerName' defaultValue={movie.pokerName} onChange={inputChange} />
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <label>
                          เบอร์โทร
                        </label>
                        <Input type='tel' name='pokerTell' defaultValue={movie.pokerTell} onChange={inputChange} />
                      </Col>
                      <Col>
                        <label>
                          อีเมล
                        </label>
                        <Input type='email' name='pokerEmail' defaultValue={movie.pokerEmail} onChange={inputChange} />
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle tag='h5'>
                      Copyright(ลิขสิทธิ์)
                    </CardTitle>
                    <CardBody>
                      <Row className='content'>
                        <Col>
                          <input type="checkbox" id="thCheck" name="thCheck" checked={Checkbox.thCheck} onChange={CheckboxChange} />
                          <label className='pr-1 pl-1' for="thCheck">  ไทย</label>
                          <input type="checkbox" id="laosCheck" name="laosCheck" checked={Checkbox.laosCheck} onChange={CheckboxChange} />
                          <label className='pr-1 pl-1' for="laosCheck">  ลาว</label>
                          <input type="checkbox" id="myanmarCheck" name="myanmarCheck" checked={Checkbox.myanmarCheck} onChange={CheckboxChange} />
                          <label className='pr-1 pl-1' for="myanmarCheck">  พม่า</label>
                          <input type="checkbox" id="cambodiaCheck" name="cambodiaCheck" checked={Checkbox.cambodiaCheck} onChange={CheckboxChange} />
                          <label className='pr-1 pl-1' for="cambodiaCheck">  กัมพูชา</label>
                          <input type="checkbox" id="vietnamCheck" name="vietnamCheck" checked={Checkbox.vietnamCheck} onChange={CheckboxChange} />
                          <label className='pr-1 pl-1' for="vietnamCheck">  เวียดนาม</label>
                        </Col>
                      </Row>
                      <Row>
                        <Col className='md-2'>
                          <label>ตั้งแต่:{copyStart}</label>
                          <Input type='date' name="copyrightStart" defaultValue={copyStart} onChange={(event) => {
                            event.value = new Date(event).toLocaleDateString()
                            inputChange(event)
                          }} />
                        </Col>
                        <Col className='md-2'>
                          <label>ถึง:{copyEnd}</label>
                          <Input type='date' name="copyrightEnd" onChange={(event) => {
                            event.value = new Date(event).toLocalString()
                            inputChange(event)
                          }} />
                        </Col>
                      </Row>
                    </CardBody>
                  </CardHeader>
                </Card>
                <div className="update ml-auto mr-auto">
                  {renderButton()}
                </div>
              </Col>
              <Col md="8">
                <Card className="card-user">
                  <CardHeader>
                    <CardTitle tag="h5">Edit Profile</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <Row>
                      <Col className="pr-1" md="6">
                        <FormGroup>
                          <label>รหัส</label>
                          <Input
                            name='id'
                            placeholder="Code"
                            type="text"
                            defaultValue={movie.id}
                            onChange={inputChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="6">
                        <FormGroup>
                          <label>*ชื่ออังกฤษ</label>
                          <Input
                            name='engName'
                            placeholder="*Eng Name"
                            type="text"
                            defaultValue={movie.engName}
                            required
                            onChange={inputChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="6">
                        <FormGroup>
                          <label>
                            ชื่อไทย
                          </label>
                          <Input
                            name='thName'
                            placeholder="Th Name"
                            type="text"
                            defaultValue={movie.thName}
                            onChange={(event) => inputChange(event)}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="6">
                        <FormGroup>
                          <label>
                            ชื่ออื่นๆ
                          </label>
                          <Input
                            name='etcName'
                            placeholder="Etc Name"
                            type="text"
                            defaultValue={movie.etcName}
                            onChange={(event) => inputChange(event)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="4">
                        <FormGroup>
                          <label>ปีของหนัง(ค.ส.)</label>
                          <Input type="select" name="movieYear" defaultValue={movie.movieYear} onChange={inputChange}>
                            {yearList}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col className="px-1" md="4">
                        <FormGroup>
                          <label>จำนวนตอน</label>
                          <Input
                            type="number" name="ep" id="exampleSelect" defaultValue={movie.ep} min='0' max='999'
                            onChange={inputChange}>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="4">
                        <FormGroup>
                          <label>จำนวนแผ่น</label>
                          <Input type="number" name="disc" id="exampleSelect" defaultValue={movie.disc} min='0' max='999'
                            onChange={inputChange}>
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col className='mb-12'>
                        <Row>
                          <Col md='7'>
                            <Label>ประเภท</Label>
                            <br />
                            {renderMovieCategories}
                          </Col>
                          <Col md='2'>
                            <label>หมวด</label>
                            <FormGroup check>
                              <Label check>
                                <Input type="radio" name="serie" value='ซีรี่ย์' defaultChecked={isSerieIsSerie()} onChange={(event) => inputChange(event)} />
                                ซีรี่ย์
                              </Label>
                            </FormGroup>
                            <FormGroup check>
                              <Label check>
                                <Input type="radio" name="serie" value='ม้วนเดียว' defaultChecked={isSerieIsMovie()} onChange={(event) => inputChange(event)} />
                                ม้วนเดียว
                              </Label>
                            </FormGroup>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col className="pr-1" md="4">
                        <FormGroup>
                          <label>ตัวละครหลัก</label>
                          <Input
                            name='mainCharater'
                            placeholder="Main character"
                            type="text"
                            defaultValue={movie.mainCharater}
                            onChange={(event) => inputChange(event)}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="px-1" md="4">
                        <FormGroup>
                          <label>บริษัทผู้สร้าง</label>
                          <Input
                            name='company'
                            placeholder="Agent"
                            type="text"
                            defaultValue={movie.company}
                            onChange={(event) => inputChange(event)}
                          />
                        </FormGroup>
                      </Col>
                      <Col className="pl-1" md="4">
                        <FormGroup>
                          <label>ความยาวนาที</label>
                          <Input type="number"
                            name='length'
                            min='0' max='999'
                            defaultValue={movie.length}
                            onChange={(event) => inputChange(event)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label>เนื้อเรื่อง</label>
                          <Input
                            type="textarea"
                            name='story'
                            defaultValue={movie.story}
                            onChange={(event) => inputChange(event)}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
                <Card className="card-user">
                  <CardHeader>
                    <CardTitle tag='h5'>Dub </CardTitle>
                  </CardHeader>
                  <CardFooter>
                    <Row>
                      <Col md='2' className='pr-2'>
                        <label>สถานะการพากย์</label>
                        <Input
                          type='text'
                          name='dubstatus'
                          defaultValue={movie.dubstatus}
                          onChange={(event) => inputChange(event)}
                        />
                      </Col>
                      <Col md='4' className='px-2'>
                        <label>ทีมพากย์</label>
                        <Input
                          type='text'
                          name='dubteam'
                          defaultValue={movie.dubteam}
                          onChange={(event) => inputChange(event)}
                        />
                      </Col>
                      <Col md='4' className='px-2'>
                        <label>ชื่อนักพากย์</label>
                        <Input
                          type='text'
                          name='dubname'
                          defaultValue={movie.dubname}
                          onChange={(event) => inputChange(event)}
                        />
                      </Col>
                      <Col md='2' className='pl-2'>
                        <label>ลงบิลวันที่:{dubDate}</label>
                        <Input
                          type='date'
                          name='dubDate'
                          onChange={(event) => inputChange(event)}
                        />
                      </Col>
                    </Row>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </Form>
        </div>
      </>
    )
  }//render
  else {
    return (
      <>
        <div className='content'>
          <div className="loading">
            {loading}
          </div>
        </div>
      </>
    )
  }
}

export default ItemDetail;
