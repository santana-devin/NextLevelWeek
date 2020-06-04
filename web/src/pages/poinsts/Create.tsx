import React, { useEffect , useState ,  ChangeEvent , FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import {Map , TileLayer , Marker } from 'react-leaflet';
import './style.css';
import axios from 'axios';
import logo from '../../assets/logo.svg';

import { LeafletMouseEvent } from 'leaflet';

interface Item {
  id: number,
  title:string,
  image_url:string
}

interface UFS {
  sigla: string
}

interface CITYS {
  nome: string
}

const CreatePointer = () =>{
 const [itens,setItens] = useState<Item[]>([]);
 const [ufs,setUfS] = useState<UFS[]>([]);
 const [SelectUf, setSelectUf] = useState('0')
 const [Citys, setCitys] = useState<string[]>([]);
 const [SelectCitys, setSelectCitys] = useState('0');
 const [InicialPosition, setInicialPosition] = useState<[number,number]>([0,0]);
 const [SelectPosition, setSelectPosition] = useState<[number,number]>([0,0]);
 const [FormData, setFormaData] = useState({
   name: '',
   email:'',
   whatsapp:''
 });
 const [SelectItens, setSelectItens] = useState<number[]>([]);
 
  const history = useHistory();

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(position=>{
      const {latitude, longitude} = position.coords;

      setInicialPosition([latitude, longitude]);
    })
  })

 useEffect(() => {
   api.get('itens').then(response =>{
    setItens(response.data);
 });
 },[]);

 useEffect(() => {
  axios.get<UFS[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados/").then(response => {
    setUfS(response.data);
  });
 },[]);

 useEffect(() => {
  axios.get<CITYS[]>("https://servicodados.ibge.gov.br/api/v1/localidades/estados/"+SelectUf+"/municipios?orderBy=nome")
  .then(response => {
    const citysName = response.data.map(city=> city.nome);
    setCitys(citysName);
    //console.log("city",response.data);
  });
 },[SelectUf]);

  function handleSelectUf(event: ChangeEvent<HTMLSelectElement>){
    setSelectUf(event.target.value);
  }

 
  function handleSelectCitys(event: ChangeEvent<HTMLSelectElement>){
    setSelectCitys(event.target.value);
  }

  function handleMapClick(event: LeafletMouseEvent){
    setSelectPosition([
      event.latlng.lat,
      event.latlng.lng
    ]);
  }

  function handleChangeInput(event:ChangeEvent<HTMLInputElement>) {
    const {name,value} = event.target;
    setFormaData({...FormData, [name]:value });
  }

  function handleSelectItem(id:number){
    const allreadSelect = SelectItens.findIndex(item => item === id);

    if(allreadSelect >=0){
      const filterItem = SelectItens.filter(item => item !== id);
      setSelectItens(filterItem);
    }else{
      setSelectItens([...SelectItens,id]);
    }
  }

  async function handleSubmit(event: FormEvent){
    event.preventDefault();
    const {  name, email, whatsapp } = FormData;
    const uf = SelectUf;
    const city = SelectCitys;
    const[latitude,longitude] = SelectPosition;
    const itens = SelectItens;

    const data = {
      name,
      email,
      whatsapp,
      uf,
      city,
      latitude,
      longitude,
      itens
    }

    await api.post('points', data);

    alert("Ponto de coleta Criado!")
    history.push('/');
  }

  return(
    <div id="page-create-point">
      <header>        
          <img src={logo} alt="Ecoleta"/>
          <Link to="/">
            <FiArrowLeft />
              Voltar para Home        
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br /> ponto de coleta</h1>

        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>

          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input type="text" name="name" id="name" onChange={handleChangeInput} />
          </div>
          <div className="field-group">
            <div className="field">
            <label htmlFor="email">Email</label>
            <input type="email" name="email" id="email" onChange={handleChangeInput} />
            </div>
            <div className="field">
              <label htmlFor="whatsapp">Whatsapp</label>
              <input type="text" name="whatsapp" id="whatsapp" onChange={handleChangeInput} />
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>

            <Map center={InicialPosition} zoom={15} onclick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={SelectPosition} />
            </Map>

          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado (UF)</label>
              <select name="uf" id="uf" value={SelectUf} onChange={handleSelectUf}>
                <option value="0">Selecione um dos estados</option>
                  {ufs.map(uf => (
                    <option key={uf.sigla} value={uf.sigla}>{uf.sigla}</option>
                  ))}   
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={SelectCitys} onChange={handleSelectCitys}>
                <option value="0">Selecione uma Cidade</option>
                {Citys.map(city =>(
                  <option key={city} value={city} >{city}</option>                  
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset>
          <legend>
            <h2>Ítens de Coleta</h2>
            <span>Selecione um ou mais itens abaixo</span>
          </legend>
          <ul className="items-grid">
            {itens.map(item => (
              <li key={item.id} className={SelectItens.includes(item.id)? "selected" :''} onClick={()=>handleSelectItem(item.id)}>
                <img src={item.image_url} alt={item.title}/>
                <span>{item.title}</span>
              </li>            
            ))}
          </ul>

        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>


      </form>

  
    </div>
  );
}

export default CreatePointer;