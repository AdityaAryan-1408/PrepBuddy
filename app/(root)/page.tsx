import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import InterviewCard from "@/components/InterviewCard"
import { getCurrentUser } from "@/lib/actions/auth.action"
import { getInterviewByUserId, getLatestInterviews } from "@/lib/actions/general.action"

const page = async () => {
  const user = await getCurrentUser();



  const [userInterviewsResult, latestInterviewsResult] = user
    ? await Promise.all([
      getInterviewByUserId(user.id),
      getLatestInterviews({ userId: user.id }),
    ])
    : [null, null];


  const userInterviews = userInterviewsResult ?? [];
  const latestInterviews = latestInterviewsResult ?? [];


  const hasPastInterview = userInterviews.length > 0;
  const hasUpcomingInterviews = latestInterviews.length > 0;

  return (
    <>
      <section className='card-cta'>
        <div className='flex flex-col gap-6 max-w-lg'>
          <h2>Get Interview Ready with AI powered practice and feedback.</h2>
          <p className='text-lg'>Practice on real interview questions and get instant feedback</p>
          <Button asChild className='btn-primary max-sm:w-full'>
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>
        <Image src='/robot.png' alt='robot' width={400} height={400} className="max-sm:hidden" />
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Your Interviews</h2>
        <div className="interviews-section">
          {
            hasPastInterview ? (
              userInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>You haven't taken any interviews yet</p>
            )
          }

        </div>
      </section>
      <section className="flex flex-col gap-6 mt-8">
        <h2>Take an Interview</h2>
        <div className="interviews-section">
          {
            hasUpcomingInterviews ? (
              latestInterviews?.map((interview) => (
                <InterviewCard {...interview} key={interview.id} />
              ))
            ) : (
              <p>There are no interviews available</p>
            )
          }
        </div>
      </section>
    </>
  )
}

export default page