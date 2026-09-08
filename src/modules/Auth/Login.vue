<template>
  <div class="login">
    <v-card class="login__card" flat>
      <v-card-text>
        <h1 class="login__title">Minha Rotina</h1>
        <p class="login__subtitle">Entrar na sua conta</p>

        <v-form @submit.prevent="submit">
          <v-text-field
            v-model="email"
            label="E-mail"
            type="email"
            dense
            class="login__field"
          />
          <v-text-field
            v-model="password"
            label="Senha"
            type="password"
            dense
            class="login__field"
          />

          <p v-if="errorMessage" class="login__error">{{ errorMessage }}</p>

          <v-btn color="primary" block :loading="loading" type="submit" class="login__submit-btn">
            Entrar
          </v-btn>
        </v-form>

        <p class="login__footer">
          Não tem conta?
          <router-link to="/registrar">Cadastre-se</router-link>
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import extractErrorMessage from '@/shared/http/extract-error-message';

@Component
export default class Login extends Vue {
  private email = '';

  private password = '';

  private loading = false;

  private errorMessage = '';

  private async submit(): Promise<void> {
    this.errorMessage = '';
    this.loading = true;

    try {
      await this.$store.dispatch('auth/login', { email: this.email, password: this.password });
      const redirect = (this.$route.query.redirect as string) || '/dashboard';
      this.$router.push(redirect);
    } catch (error) {
      this.errorMessage = extractErrorMessage(error, 'E-mail ou senha inválidos.');
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="sass" scoped>
.login
  display: flex
  justify-content: center
  align-items: center
  min-height: 80vh

  &__card
    width: 100%
    max-width: 360px

  &__title
    font-size: 24px
    font-weight: 800
    margin-bottom: 4px

  &__subtitle
    opacity: 0.6
    margin-bottom: 20px

  &__field
    margin-bottom: 8px

  &__error
    color: var(--v-error-base)
    font-size: 13px

  &__submit-btn
    margin-top: 8px

  &__footer
    margin-top: 20px
    font-size: 14px
    text-align: center
</style>
