<template>
  <div class="flex content-center min-w-full min-h-full">
    <SurveyComponent :model="survey" />
  </div>
</template>

<script lang="ts" setup>
import { SurveyComponent } from 'survey-vue3-ui';
import { Model } from 'survey-core';
import { generateRandomID } from '~/server/utils/stringGenerator';
import { industryDropdownChoices } from '~/models/choices';
import 'survey-core/survey-core.css';

const surveyModel = {
  pages: [{
      title: 'Scheduling & Meetups',
      elements: [
      {
        name: "overall-satisfaction",
        title: "On a scale of 1-100, rate your scheduling this week overall. (Be honest!)",
        type: 'slider',
        isRequired: false
      },
      {
        name: 'meeting-frequency',
        title: ""
      }
    ]
  }]
}

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

const survey = new Model(surveyModel)
survey.onComplete.add(surveyComplete)
//NOW WE MOVE THE DATA:
const SURVEY_ID = 1 

const companyReturn = async (results: any) => { 
  console.log('we go')
  const result = await $fetch('/api/company/createCompany', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(results)
  });
  if(result){
    console.log("success! Company Added")
    console.log(result.status, ': ', result.companyId)
    //do stuff when company added, redirect and guide to main user login.
    navigateTo(`/newCompany/${result.companyId}`)
  } else {
    console.error("something went wrong! add failed.")
  }
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
  const finalCompany = {
    companyID: survey.data.companyID,
    companyInfo: {
      name: survey.data.companyInfo_name,
      industry: survey.data.companyInfo_industry,
      size: survey.data.companyInfo_size,
      localization: {
        city: survey.data.companyInfo_localization_city,
        state: survey.data.companyInfo_localization_state,
        postzip: survey.data.companyInfo_localization_postzip,
        timezone: survey.data.companyInfo_localization_timezone,
      }
    },
    bobInfo: {
      bobInstanceID: 'BOB-' + generateRandomID(9),
      specifications: {
        tone: survey.data.bobInfo_specifications_tone ?? 'default',
        description: survey.data.bobInfo_specifications_description ?? 5,
        avoid: avoidItem ?? [],
      }
    },
    adminAccounts: [],
    website: survey.data.website,
    companyRoles: companyItem ?? ['admin', 'user']
  }
  console.log('guy made')
  return finalCompany
}
</script>

<style>

</style>