import { FC, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { BsMusicNoteBeamed } from 'react-icons/bs'
import { AiFillHeart } from 'react-icons/ai'
import tiktokLogo from '../assets/images/tiktok-logo-white.png'
import { IoChatboxEllipses } from 'react-icons/io5'
import { IoIosShareAlt } from 'react-icons/io'
import { PostType } from '../gql/graphql'

type PostFeedPropsType = {
  post: PostType
}

const PostFeed: FC<PostFeedPropsType> = ({ post }) => {
  const video = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '0px',
      threshold: 1
    }

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          video.current?.play()
        } else {
          video.current?.pause()
        }
      })
    }

    const observer = new IntersectionObserver(callback, options)

    if (video.current) {
      observer.observe(video.current)
    }

    return () => {
      if (video.current) {
        observer.unobserve(video.current)
      }
    }
  }, [])

  return (
    <div id="post-feed" className="flex border-b py-6">
      <div className="cursor-pointer">
        <img
          className="rounded-full max-h-[190px] "
          src={
            post.user.image
              ? `${import.meta.env.VITE_PUBLIC_FOLDER_URL}${post.user.image}`
              : 'http://picsum.photos/200'
          }
          alt={post.user.name}
          width="60"
        />
      </div>
      <div className="pl-3 w-full px-4">
        <div className="flex items-center justify-between pb-0.5">
          <Link to={`/profile/${post.user.id}`}>
            <span className="font-bold hover:underline cursor-pointer">
              {post.user.name}
            </span>
            <span className="text-[13px] text-light text-gray-500 pl-1 cursor-pointer">
              #{post.user.name}
            </span>
          </Link>
          <button className="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#FFEEF2] font-semibold rounded-mb">
            Follow
          </button>
        </div>
        <div className="text-[15px] pb-0.5 break-words md:max-w-[480px] max-w-[300px]">
          This is some text
        </div>
        <div className="text-[14px] text-gray-500 pb-0.5">
          #fun #cooll #tiktok
        </div>
        <div className="text-[14px] pb-0.5 flex items-center font-semibold">
          <BsMusicNoteBeamed size="17" />
          <div className="px-1">original - Awesome</div>
          <AiFillHeart size="20" />
        </div>
        <div className="mt-2.5 flex">
          <div className="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl">
            <video
              ref={video}
              src={import.meta.env.VITE_PUBLIC_FOLDER_URL + post.video}
              loop
              muted
              className="rounded-xl object-cover mx-auto h-full"
            />
            <img
              src={tiktokLogo}
              alt="tiktok"
              className="absolute right-2 bottom-14"
              width="90"
            />
          </div>
          <div className="relative mr-[75px]">
            <div className="absolute bottom-0 pl-2 flex items-center flex-col">
              <button className="rounded-full bg-gray-200 p-2 cursor-pointer">
                <AiFillHeart size="25" color="black" />
              </button>
              <span className="text-xs text-gray-800 font-semibold">
                {post.likes?.length}
              </span>
              <button className="rounded-full bg-gray-200 p-2 cursor-pointer">
                <IoIosShareAlt size="25" color="black" />
              </button>
              <span className="text-xs text-gray-800 font-semibold">34</span>
              <button className="rounded-full bg-gray-200 p-2 cursor-pointer">
                <IoChatboxEllipses size="25" color="black" />
              </button>
              <span className="text-xs text-gray-800 font-semibold">40</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostFeed
