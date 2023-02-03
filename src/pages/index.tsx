// ts ignore entire file
// @ts-nocheck


import { useEffect, useState } from 'react'
import { background, Button, Card, Center, Heading, ListItem, IconButton, UnorderedList } from '@chakra-ui/react'
import { Head } from 'components/layout/Head'
import { LinkComponent } from 'components/layout/LinkComponent'
import { useAccount } from "wagmi";
import { RepeatIcon } from '@chakra-ui/icons';

import {
  Box, Container, Flex, CardHeader, CardBody,

  Editable as ChakraEditable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
} from '@chakra-ui/react'

// Slate
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

// Import the Slate editor factory.
import { createEditor } from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'
import { ConnectKitButton } from 'connectkit';

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}

export default function Home() {
  const { address, isConnecting, isDisconnected } = useAccount();


  return (
    <>
      <Head title='Basic Notes' />

      {
        isConnecting ? <div>Connecting...</div> :
          <>
            {isDisconnected ?
              <div style={{ display: 'flex', justifyContent: 'center', alignContent: 'center', flex: 1 }}>
                <Card h={150} mt={200}>
                  <CardHeader>Sign in to continue.</CardHeader>
                  <CardBody>
                    <ConnectKitButton />
                  </CardBody>
                </Card>
              </div>
              :
              <NotesContainer address={address} />
            }
          </>
      }

      {/* <main > */}
      {/* <Heading as="h2">Basic</Heading>
        <UnorderedList>
          <ListItem>
            <LinkComponent href="/examples/sign">Sign & verify messages</LinkComponent>
          </ListItem>
          <ListItem>
            <LinkComponent href="/examples/siwe">Sign-in With Ethereum</LinkComponent>
          </ListItem>
        </UnorderedList> */}
      {/* </main> */}
    </>
  )
}


const NotesContainer = ({ address }: { address: string }) => {

  const [title, setTitle] = useState('Untitled')
  const [content, setContent] = useState('')
  const [updating, setUpdating] = useState(false)
  const [notes, setNotes] = useState([])
  const [editMode, setEditMode] = useState(false)

  const [editor] = useState(() => withReact(createEditor()))



  const fetchAllNotes = async () => {
    setUpdating(true)
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{"account_id":"${address}","project_id":"EZjEWKVyJ5QYdrPiNt2D","table_id":"notes"}`
    };

    const resp = await fetch('https://basic-alpha.netlify.app/api/net/account/get', options)
      .then(response => response.json())
      // .then(response => console.log(response))
      .catch(err => console.error(err));

    console.log(resp)
    setNotes(resp.data)
    setUpdating(false)
  }

  const handleSave = async () => {
    const data = {
      account_id: address,
      project_id: 'EZjEWKVyJ5QYdrPiNt2D',
      table_id: 'notes',
      payload: {
        title: title,
        content: content
      }
    }
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    };

    console.log(options)

    const resp = await fetch('https://basic-alpha.netlify.app/api/net/account/save', options)
      .then(response => response.json())
      // .then(response => console.log(response))
      .catch(err => console.error(err));

    console.log(resp)

    fetchAllNotes()

  }

  const handleNew = () => {
    setEditMode(true)
    setTitle('Untitled')
    setContent('write anything...')
  }

  const handleSet = (title: string, content: string) => {
    setEditMode(false)
    console.log("settting", title)
    setTitle(title)
    setContent(content)
  }

  const TextBox = () => {

    return (
      //@ts-ignore
      <Slate editor={editor} value={initialValue}
        onChange={value => {
          const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
          )
          // console.log('isAstChange: ', isAstChange, value)
          if (isAstChange) {
            // Save the value to Local Storage.
            const content = JSON.stringify(value)
            console.log("value: ", content)
            setContent(content)
            // localStorage.setItem('content', content)
          }
        }}
      >
        <Editable />
      </Slate>
    )
  }

  useEffect(() => {
    fetchAllNotes()
    // setUpdating(true)
    // setTimeout(() => {
    //   setUpdating(false)
    // }
    //   , 3000)
  }, [])

  return (
    <div style={{ flex: 1, margin: 0, display: 'flex', overflow: 'hidden', maxHeight: '100vh' }}>

      <div style={{ borderWidth: 0, width: 300, margin: 0, overflow: 'scroll' }}>
        <div style={{ padding: 10, display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
          <IconButton isLoading={updating} onClick={() => fetchAllNotes()} icon={<RepeatIcon />} />
          <Button onClick={() => handleNew()}>New</Button>
        </div>

        {notes.map((note: any) => {
          return (<CardItem key={note.id} title={note.title} content={note.content} clicked={handleSet} />)
        })}
      </div>

      <Flex style={{ flex: 1, overflow: 'scroll' }} bg="rgb(12, 12, 12, 0.7)" overflow={"scroll"}>
        <Container pt={2} >

          <div style={{ display: 'flex', justifyContent: 'space-between', alignContent: 'cneter' }}>

            {editMode ?

              <Heading as="h2" mb="2">
                <ChakraEditable defaultValue={title} onChange={(e) => {
                  setTitle(e)
                  console.log(e)
                }}>
                  <EditablePreview />
                  <EditableInput />
                </ChakraEditable>
              </Heading>
              :
              <Heading as="h2" mb="2">{title}</Heading>
            }

            <Button isLoading={updating} onClick={() => handleSave()}>Save</Button>
          </div>


          {!editMode ?
            <p>{content}</p>
            :
            // <TextBox updateContent={(e) => setContent(e)} />
            <ChakraEditable defaultValue={content} onChange={(e) => {
              setContent(e)
              console.log(e)
            }}>
              <EditablePreview />
              <EditableInput />
            </ChakraEditable>
          }

        </Container>
      </Flex>
    </div>
  )
}

const CardItem = ({ title, content, clicked }: { title: string, content: string, clicked: any }) => {
  return (
    <Box bg="rgb(12, 12, 12, 0.0)" m="2" py="5" rounded={"md"} shadow="sm" onClick={() => {
      console.log('clicked', title, content)
      clicked(title, content)
    }}>
      <Container>

        <Heading size={"md"} color="#CCCCCC">
          {title}
        </Heading>

        <p >{content}</p>
      </Container>

    </Box>
  )
}

// Add the initial value.
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'Write anything...' }],
  },
]


