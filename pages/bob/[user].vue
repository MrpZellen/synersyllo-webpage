<template>
  <div class="flex content-center min-w-full min-h-full">
    <SurveyComponent :model="survey" />
  </div>
</template>

<script lang="ts" setup>
import { SurveyComponent } from 'survey-vue3-ui';
import { Model } from 'survey-core';
import { generateRandomID } from '~/server/utils/stringGenerator';
import { useRoute } from 'vue-router';
import { industryDropdownChoices } from '~/models/choices';
import 'survey-core/survey-core.css';

const surveyModel = {
  title: "Employee Feedback Survey",
  showProgressBar: "top",
  pages: [
    {
      name: "Scheduling & Meetups",
      title: "Scheduling & Meetups",
      description: "Note: Serious matters or concerns should be brought up to management or HR.",
      elements: [
        {
          type: "rating",
          name: "scheduling_rating",
          title: "On a scale of 1-10, rate your scheduling overall.",
          minRateDescription: "No meetings, massive confusion",
          maxRateDescription: "Overscheduled, no time to work",
          rateMin: 1,
          rateMax: 10,
          step: 1,
          showMinMaxLabels: true
        },
        {
          type: "comment",
          name: "unnecessary_schedule_items",
          title: "Anything on your schedule that was unnecessary this week?"
        },
        {
          type: "comment",
          name: "schedule_additions",
          title: "Anything you wish you had more of on your schedule?"
        },
        {
          type: "rating",
          name: "workload_fairness",
          title: "The workload is balanced fairly between employees in your department.",
          rateValues: ["Heavily disagree", "Disagree", "Neutral", "Agree", "Heavily agree"]
        },
        {
          type: "rating",
          name: "assistance_availability",
          title: "There are sufficient avenues to receive assistance if I need it.",
          rateValues: ["Heavily disagree", "Disagree", "Neutral", "Agree", "Heavily agree"]
        },
        {
          type: "rating",
          name: "manager_accessibility",
          title: "Management has open times to meet with me when needed.",
          rateValues: ["Heavily disagree", "Disagree", "Neutral", "Agree", "Heavily agree"]
        },
        {
          type: "rating",
          name: "checkin_comfort",
          title: "I am comfortable with check-ins and I feel I can share my mind.",
          rateValues: ["Heavily disagree", "Disagree", "Neutral", "Agree", "Heavily agree"]
        },
        {
          type: "boolean",
          name: "scheduling_needs_met",
          title: "Have your scheduling needs been met?",
          labelTrue: "Yes",
          labelFalse: "No"
        },
        {
          type: "boolean",
          name: "pto_respected",
          title: "Has your PTO been respected over the past 2 months (if relevant)?",
          labelTrue: "Yes",
          labelFalse: "No"
        },
        {
          type: "comment",
          name: "notes_on_scheduling",
          title: "Any notes on scheduling and meetups?"
        }
      ]
    },
    {
      name: "Work/Life Balance",
      title: "Work/Life Balance",
      description: "Note: Serious matters or concerns should be brought up to management or HR.",
      elements: [
        {
          type: "rating",
          name: "work_home_balance",
          title: "My work doesn't encroach on my time at home.",
          rateValues: ["Heavily disagree", "Disagree", "Neutral", "Agree", "Heavily agree"]
        },
        {
          type: "comment",
          name: "home_impact",
          title: "Recount this past week's experiences at work, and if they affected your time at home."
        },
        {
          type: "dropdown",
          name: "breaks_this_week",
          title: "How many breaks did you get this week?",
          choices: ["None", "A few", "A good amount", "A lot"]
        },
        {
          type: "boolean",
          name: "has_remote_or_hybrid",
          title: "Do you have Remote or Hybrid Work?",
          labelTrue: "Yes",
          labelFalse: "No"
        },
        {
          type: "panel",
          name: "remote_hybrid_panel",
          visibleIf: "{has_remote_or_hybrid} = true",
          elements: [
            {
              type: "rating",
              name: "virtual_engagement",
              title: "How engaged are you in virtual meetings?",
              rateMin: 1,
              rateMax: 10
            },
            {
              type: "comment",
              name: "meeting_improvement",
              title: "Is there any way you would like meetings to be improved?"
            },
            {
              type: "rating",
              name: "feel_heard_by_management",
              title: "Do you feel heard by management?",
              rateMin: 1,
              rateMax: 10
            },
            {
              type: "rating",
              name: "timely_response",
              title: "Management replies to my messages in a timely manner.",
              rateValues: ["Heavily disagree", "Disagree", "Neutral", "Agree", "Heavily agree"]
            },
            {
              type: "comment",
              name: "remote_notes",
              title: "Is there anything you would like to add about Remote or Hybrid work?"
            }
          ]
        },
        {
          type: "rating",
          name: "help_seeking_frequency",
          title: "On a scale of 1-10, how often do you reach out for help with something?",
          rateMin: 1,
          rateMax: 10
        },
        {
          type: "comment",
          name: "worklife_notes",
          title: "Anything you would like to add as notes?"
        }
      ]
    },
    {
      name: "Company & Group Specifics",
      title: "Company & Group Specifics",
      description: "Note: Serious matters or concerns should be brought up to management or HR.",
      elements: [
        {
          type: "html",
          name: "company_specific_placeholder",
          html: "<i>This page is loaded dynamically based on company data. It will be populated from the API.</i>"
        }
      ]
    }
  ]
};
const surveyComplete = (survey: any) => {
  console.log('hi, we did surveys')
  const companyID = 'COM-' + generateRandomID(9)
  console.log('generatedNum')
  survey.setValue("companyID", companyID);
  console.log('value set')
  const results = defineSurveySchema(survey)
  console.log('schema defined')

  //call api to save company scheme
  companyReturn(JSON.parse(JSON.stringify(results)))
}
const router = useRoute()
const username = router.params.user

const survey = new Model(surveyModel)
survey.onComplete.add(surveyComplete)
//NOW WE MOVE THE DATA:
const SURVEY_ID = 1 

const companyReturn = async (results: any) => { 
  console.log('we go')
  navigateTo(`/api/calendar/${username}`)
}

const defineSurveySchema = (survey: any) => {
  var avoidItem, companyItem = []
  if(survey.data.bobInfo_specifications_avoid){
    avoidItem = survey.data.bobInfo_specifications_avoid.split(',');
  }
  if(survey.data.companyRoles){
    companyItem = survey.data.companyRoles.split(',');
    companyItem.append('admin')
    companyItem.append('user')
  }
  console.log(survey.data)
  const structuredOutput = {
    schedulingMeetups: {
      schedulingRating: survey.data.scheduling_rating,
      unnecessaryScheduleItems: survey.data.unnecessary_schedule_items,
      scheduleAdditions: survey.data.schedule_additions,
      workloadFairness: survey.data.workload_fairness,
      assistanceAvailability: survey.data.assistance_availability,
      managerAccessibility: survey.data.manager_accessibility,
      checkinComfort: survey.data.checkin_comfort,
      schedulingNeedsMet: survey.data.scheduling_needs_met,
      ptoRespected: survey.data.pto_respected,
      notesOnScheduling: survey.data.notes_on_scheduling
    },
    workLifeBalance: {
      workHomeBalance: survey.data.work_home_balance,
      homeImpact: survey.data.home_impact,
      breaksThisWeek: survey.data.breaks_this_week,
      hasRemoteOrHybrid: survey.data.has_remote_or_hybrid,
      remoteHybrid: survey.data.has_remote_or_hybrid ? {
        virtualEngagement: survey.data.virtual_engagement,
        meetingImprovement: survey.data.meeting_improvement,
        feelHeardByManagement: survey.data.feel_heard_by_management,
        timelyResponse: survey.data.timely_response,
        remoteNotes: survey.data.remote_notes
      } : null,
      helpSeekingFrequency: survey.data.help_seeking_frequency,
      worklifeNotes: survey.data.worklife_notes
    },
    companySpecific: {
    }
  };
  console.log('survey sent!')
  return structuredOutput
}
</script>

<style>

</style>