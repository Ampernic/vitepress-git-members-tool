<script setup lang="ts">
import { VPTeamPage, VPTeamPageTitle, VPButton, VPTeamMembers } from 'vitepress/theme'

import { sortMembers } from '../composables/sorters'
import {default as map} from '../../../_data/teama.json'
import {settings} from '../../../_data/team.json'
</script>

<template>
  <ClientOnly>
    <VPTeamPage>
      <VPTeamPageTitle>
        <template #title> Участники </template>
      </VPTeamPageTitle>
      <VPTeamMembers :members="sortMembers(map, settings.home.sorting).slice(0, settings.home.limit)" />
      <div class="teamButton">
        <VPButton text="Все участники" class="button" size="big" href="/contributions" />
      </div>
    </VPTeamPage>
  </ClientOnly>
</template>

<style scoped>
.teamButton {
  margin-top: 40px;
  display: grid;
  place-items: center;
}
</style>
