import React, {useState} from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/react-hooks'
import PetsList from '../components/PetsList'
import NewPetModal from '../components/NewPetModal'
import Loader from '../components/Loader'

const PETS_FIELDS = gql`
  fragment PetsFields on Pet {
    id
      name
      type
      img
      vaccinated @client
      owner {
        id
        age @client
      }
  }
`
const ALL_PETS = gql`
  query AllPets {
    pets {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`

const ADD_PET = gql`
  mutation CreatePet($newPet: NewPetInput!) {
    addPet(input: $newPet) {
      ...PetsFields
    }
  }
  ${PETS_FIELDS}
`
export default function Pets () {
  const [modal, setModal] = useState(false)
  const {data, loading, error} = useQuery(ALL_PETS)
  const [createPet, newPet] = useMutation(ADD_PET, {
    update(cache, {data: {addPet}}) {
      const { pets } = cache.readQuery({ query: ALL_PETS })
      cache.writeQuery({
        query: ALL_PETS,
        data: { pets: [addPet].concat(pets)}
      })
    }
  })
  const onSubmit = input => {
    setModal(false)
    createPet({
      variables: {newPet: input},
      optimisticResponse: {
        __typename: "Mutation",
        addPet: {
          id: "temp",
          __typename: "Pet",
          name: input.name,
          type: input.type,
          img: "https://via.placeholder.com/300",
          owner: {
            id: 'none',
            age: 21
          },
          vaccinated: false
      }}
    })
  }
  if (loading) {
    return <Loader />
  }

  if (error || newPet.error) {
    return <p>ERROR</p>
  }
  console.log(data.pets[0])
  if (modal) {
    return <NewPetModal onSubmit={onSubmit} onCancel={() => setModal(false)} />
  }

  return (
    <div className="page pets-page">
      <section>
        <div className="row betwee-xs middle-xs">
          <div className="col-xs-10">
            <h1>Pets</h1>
          </div>

          <div className="col-xs-2">
            <button onClick={() => setModal(true)}>new pet</button>
          </div>
        </div>
      </section>
      <section>
        <PetsList pets={loading ? [] : data.pets}/>
      </section>
    </div>
  )
}
