import React, { useEffect, useState } from 'react'
import appwriteService from '../appwrite/conf'
import { useParams} from 'react-router-dom'
import { useNavigate } from 'react-router-dom';
import { Container,PostForm } from '../components'
useState

function Editpost() {
    const [post, setPosts] = useState(null)
    const {slug} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (slug) {
            appwriteService.getPost(slug).then((post) => {
                if (post) {
                    setPosts(post)
                }
            })
        } else {
            navigate('/')
        }
    }, [slug, navigate])
  return post ? (
    <div className='py-8'>
        <Container>
            <PostForm post={post} />
        </Container>
    </div>
  ) : null
}

export default Editpost