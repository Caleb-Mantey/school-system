module.exports = function (grunt) {
  const deployConfigs = grunt.file.readJSON('deploy.json');
  const path = deployConfigs.deploy_path;
  const env_file = deployConfigs.env_file;
  const repo = deployConfigs.git_repo;
  const branch = deployConfigs.branch.staging;
  const app_name = deployConfigs.app_name;

  grunt.initConfig({
    exec: {
      controller: {
        cmd: function (name) {
          return 'nest g controller app/controllers/' + name;
        },
      },
      service: {
        cmd: function (name) {
          return 'nest g service app/services/' + name;
        },
      },
      module: {
        cmd: function (name) {
          return 'nest g module app/modules/' + name;
        },
      },
      gateway: {
        cmd: function (name) {
          return 'nest g gateway app/gateway/' + name;
        },
      },
      guard: {
        cmd: function (name) {
          return 'nest g guard app/guards/' + name;
        },
      },
      decorator: {
        cmd: function (name) {
          return 'nest g decorator app/decorators/' + name;
        },
      },
      interceptor: {
        cmd: function (name) {
          return 'nest g interceptor app/interceptors/' + name;
        },
      },
      interface: {
        cmd: function (name) {
          return 'nest g interface app/interfaces/' + name;
        },
      },
      create_migration: {
        cmd: function (name) {
          return (
            'npm run typeorm migration:generate ./src/db/migrations/' + name
          );
        },
      },
      staging_logs: {
        cmd: function () {
          return `ssh -t deploy@staging.dropinghana.com 'bash -i -c "pm2 logs ${app_name}" '`;
        },
      },
      production_logs: {
        cmd: function () {
          return `ssh -t deploy@prod.dropinghana.com 'bash -i -c "pm2 logs ${app_name}" '`;
        },
      },
      setup_staging_server: {
        cmd: function () {
          const init = `ssh deploy@staging.dropinghana.com "cd ${path}; mkdir current -p; mkdir releases -p; cd current; git clone ${repo} .; git checkout ${branch}; cp ${env_file} ./;exit;"`;
          const deploy = ` && ssh -t deploy@staging.dropinghana.com 'bash -i -c "cd ${path}; cd current; npm ci; npm run build; npm run migration; npm run compodoc; pm2 start npm --name '${app_name}' -- run start:prod;"'`;
          return init + deploy;
        },
      },
      setup_db_backup: {
        cmd: function () {
          /* Put this script in backup_script.sh file.
             #!/bin/bash
             DB_NAME=your_database_name
             DB_USER=your_database_user
             DB_PASS=your_database_password
             BACKUP_DIR=/backups
             DATE=$(date +"%Y-%m-%d_%H-%M-%S")
             BACKUP_NAME=$BACKUP_DIR/$DB_NAME-$DATE.sql

             # Delete backups older than 10 days
             find $BACKUP_DIR -type f -name "$DB_NAME*.sql" -mtime +10 -delete

             # Create new backup
             mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_NAME
             cp $BACKUP_NAME $PUBLIC_DIR/latest.sql

             # Delete old backups and keep only the last 10
             backup_files=$(ls -1 $BACKUP_DIR/$DB_NAME-*.sql 2>/dev/null | head -n -10)
             if [ -n "$backup_files" ]; then
                echo "$backup_files" | xargs rm -f
             fi
          */

          /* sudo crontab -e
             Add the following line to the crontab file to run the script daily at midnight:
             0 0 * * * /path/to/backup_script.sh
          */

          const setup = `ssh deploy@staging.dropinghana.com "cd ${path}; mkdir db_backups -p; cd db_backups; touch backup_script.sh; chmod +x backup_script.sh; cd ${path}; cd current; mkdir uploads -p; cd uploads; mkdir db -p; exit;"`;
          return setup;
        },
      },
      run_db_backup: {
        cmd: function () {
          const setup = `ssh deploy@staging.dropinghana.com "cd ${path}; cd db_backups;  ./backup_script.sh; exit;"`;
          return setup;
        },
      },
      get_db_backup: {
        cmd: function () {
          const setup = `mkdir uploads/db -p; curl -o ./uploads/db/latest.sql https://staging.dropinghana.com/api/v1/files/db/latest.sql`;
          return setup;
        },
      },
      deploy_staging: {
        cmd: function () {
          const backupCurrentRelease = `ssh -t deploy@staging.dropinghana.com 'bash -i -c "cd ${path}; cp -r current releases/$EPOCHSECONDS; cd releases; ls -td */ > versions.txt;"'`;
          const deploy = ` && ssh -t deploy@staging.dropinghana.com 'bash -i -c "cd ${path}; cd current; cp ${env_file} ./; git stash; git pull; npm ci; npm run build; npm run migration; npm run compodoc; pm2 restart '${app_name}';"'`;
          return backupCurrentRelease + deploy;
        },
      },
      rollback_staging: {
        cmd: function () {
          const start = `ssh -t deploy@staging.dropinghana.com 'bash -i -c "if [[ "$(ls -td -- ${path}/releases/*/ | head -n 1)" =~ releases ]]; then echo 'Found an old release creating a backup.......'; else exit; fi; cd $(ls -td -- ${path}/releases/*/ | head -n 1); pwd; tar cf backup.tar ."'`;
          const rollback = ` && ssh -t deploy@staging.dropinghana.com 'bash -i -c "if [[ "$(ls -td -- ${path}/releases/*/ | head -n 1)" =~ releases ]]; then echo 'Moving backup into current release.....'; else exit; fi; cd ${path}/current; tar xvf $(ls -td -- ${path}/releases/*/ | head -n 1)backup.tar;"'`;
          const deploy = ` && ssh -t deploy@staging.dropinghana.com 'bash -i -c "if [[ "$(ls -td -- ${path}/releases/*/ | head -n 1)" =~ releases ]]; then echo 'Running npm scripts.....'; else exit; fi; cd ${path}; cd current; npm ci; npm run build; npm run migration; npm run compodoc; pm2 restart '${app_name}';"'`;
          const deleteRelease = ` && ssh -t deploy@staging.dropinghana.com 'bash -i -c "if [[ "$(ls -td -- ${path}/releases/*/ | head -n 1)" =~ releases ]]; then echo 'Clearing previous release....'; else exit; fi;cd ${path}; rm -rf $(ls -td -- ${path}/releases/*/ | head -n 1);"'`;
          return start + rollback + deploy + deleteRelease;
        },
      },
    },
  });
  grunt.loadNpmTasks('grunt-exec');
  grunt.registerTask('logs:staging', 'exec:staging_logs');
  grunt.registerTask('logs:prod', 'exec:production_logs');
  grunt.registerTask('deploy:staging', 'exec:deploy_staging');
  grunt.registerTask('setup:staging', 'exec:setup_staging_server');
  grunt.registerTask('rollback:staging', 'exec:rollback_staging');
  grunt.registerTask('backupDB:staging', 'exec:run_db_backup');
  grunt.registerTask('getDB:staging', 'exec:get_db_backup');
};
